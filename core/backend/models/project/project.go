package project

import (
	"context"
	"encoding/json"
	"go_fyp/core/backend/services/database"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"

	"log"

	"github.com/ghodss/yaml"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

//for scan result
type History struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	PID       string             `bson:"pid"`
	StartTime int64                `bson:"startTime"`
	EndTime   int64                `bson:"endTime"`
	Result    []string           `bson:"result"`
	Status    string             `bson:"status"`
	CVECount  map[string]int           `bson:"cvecount"`
}

type InputCreateProject struct {
	Name     string   `json:"name"`
	Fid      string   `json:"fid"`
	Host     []string `json:"host"`
	Poc      []string `json:"poc"`
	Template string   `json:"template"`
}

type Folder struct {
	Name     string   `json:"name"`
	Project  []ProjectItem  `json:"project"`
	Status   string   `json:"status"`
	Lastscan int      `json:"lastscan"`
	Ownerid  int      `json:"ownerid"`
}

type ProjectItem struct {
	Pid      primitive.ObjectID `json:"pid"`
	Name     string             `json:"name"`
	Host     []string           `json:"host"`
	Poc      []string           `json:"poc"`
	History  []string			`json:"history"`
	LastScan int                `json:"lastscan"`
	Schedule string             `json:"schedule"`
	Status   string             `json:"status"`
}

// From 127.0.0.1:8888/project/startScan
type ScanRequest struct {
	ID []string `json:"ID"`
	PID string `json:"PID"`
	Host []string `json:"host"`
}

// for delete
type InputDeleteProject struct {
	Fid string `json:"fid"`
	//RowId string  `json:"rowId"`
	Pid string `json:"pid"`

}

type ScanOutput struct {
    TemplateID string
    Protocol   string
    Severity   string
    URL        string
}

// For parseCVECount in startScan
type CVECount struct {
    Info     int
    Low      int
    Medium   int
    High     int
    Critical int
}


// For find
type Template struct {
	ID   string `json:"id"`
	Info struct {
		Name        string   `json:"name,omitempty"`
		Author      string   `json:"author,omitempty"`
		Severity    string   `json:"severity,omitempty"`
		Description string   `json:"description,omitempty"`
		Remediation string   `json:"remediation,omitempty"`
		Reference   []string `json:"reference,omitempty"`
		
		Classification struct {
			CvssMetrics string  `json:"cvss-metrics,omitempty"`
			CvssScore   float64 `json:"cvss-score,omitempty"`
			CveID       string  `json:"cve-id,omitempty"`
			CweID       string  `json:"cwe-id,omitempty"`
		} `json:"classification,omitempty"`
		
		Metadata struct {
			Verified    bool   `json:"verified,omitempty"`
			ShodanQuery string `json:"shodan-query,omitempty"`
			MaxRequest int `json:"max-request,omitempty"`
		} `json:"metadata,omitempty"`
		
		Tags string `json:"tags,omitempty"`
	} `json:"info,omitempty"`

	Variables map[string]interface{} `json:"variables,omitempty"`

	HTTP []struct {
		Method            string `json:"method,omitempty"`
		Path              []string `json:"path,omitempty"`
		Raw               []string `json:"raw,omitempty"`
		Payloads          map[string]string `json:"payloads,omitempty"`
		Threads           int               `json:"threads,omitempty"`
		StopAtFirstMatch  bool `json:"stop-at-first-match,omitempty"`
		MatchersCondition string `json:"matchers-condition,omitempty"`
		//
		Matchers []struct {
			Type      string   `json:"type,omitempty"`
			Part      string   `json:"part,omitempty"`
			Words     []string `json:"words,omitempty"`
			Dsl       []string `json:"dsl,omitempty"`
			Regex     []string `json:"regex,omitempty"`
			Condition string   `json:"condition,omitempty"`
			Status    []int    `json:"status,omitempty"`
		} `json:"matchers,omitempty"`
		
		Extractors []struct {
			Type  string   `json:"type,omitempty"`
			Name  string   `json:"name,omitempty"`
			Json  []string `json:"json,omitempty"`
			Part  string   `json:"part,omitempty"`
		} `json:"extractors,omitempty"`
	} `json:"http,omitempty"`
	
}

var templatesCollection *mongo.Collection
var folderCollection *mongo.Collection
var scanResultsCollection *mongo.Collection

func init() {
	var err error

	templatesCollection, err = database.InitializeMongoDB("Templates")
	if err != nil {
		log.Fatalf("Error initializing MongoDB Templates collection: %v\n", err)
	} else {
		log.Println("MongoDB (Templates) initialized successfully")
	}

	folderCollection, err = database.InitializeMongoDB("Folder")
	if err != nil {
		log.Fatalf("Error initializing MongoDB Folder collection: %v\n", err)
	} else {
		log.Println("MongoDB (Folder) initialized successfully")
	}

	scanResultsCollection, err = database.InitializeMongoDB("History")
	if err != nil {
		log.Fatalf("Error initializing MongoDB History collection: %v\n", err)
	} else {
		log.Println("MongoDB (History) initialized successfully")
	}

	
}

func ProjectCreateHandler(c *gin.Context) {
	var inputData InputCreateProject

	if err := c.ShouldBindJSON(&inputData); err != nil {
		// c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var poc []string
	switch inputData.Template {
	case "customs":
		poc = inputData.Poc
	case "wordpress":
		poc = []string{"wp"}
	}

	var primary_id = primitive.NewObjectID()
	var newProject = ProjectItem{primary_id, inputData.Name, inputData.Host, poc, []string{}, 1000, "onDemand", "idle"}

	result, err := addProjectToFolder(newProject, inputData.Fid)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{
			//Template updated successfully
			"action": "success",
			"result": result,
		})
		return
	}

}

func addProjectToFolder(projectDetail ProjectItem, fid string) (bson.M, error) {
	var result bson.M

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, _ := primitive.ObjectIDFromHex(fid)
	filter := bson.M{"_id": objID}
	update := bson.M{
		"$push": bson.M{"project": projectDetail},
	}

	err := folderCollection.FindOneAndUpdate(ctx, filter, update).Decode(&result)
	return result, err
}

func addHIDToFolder(projectDetail ProjectItem, pid string) (bson.M, error) {
	var result bson.M

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, _ := primitive.ObjectIDFromHex(pid)
	filter := bson.M{"pid": objID}
	update := bson.M{
		"$push": bson.M{"project": projectDetail},
	}

	err := folderCollection.FindOneAndUpdate(ctx, filter, update).Decode(&result)
	return result, err
}

func UpDateProjectProfile() {

}

func RemoveProjectFromFolder(c *gin.Context) {
	var reqBody InputDeleteProject
	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	folderID, err := primitive.ObjectIDFromHex(reqBody.Fid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid folder ID format"})
		return
	}

	projectID, err := primitive.ObjectIDFromHex(reqBody.Pid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID format"})
		return
	}

	updateResult, err := folderCollection.UpdateOne(
		context.TODO(),
		bson.M{"_id": folderID},
		bson.M{
			"$pull": bson.M{
				"project": bson.M{
					"pid": projectID,
				},
			},
		},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if updateResult.ModifiedCount == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No changes made to the folder"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted project"})
}





func GetPOEList() {

}


func StartScan(c *gin.Context) {
	var req ScanRequest

	// Bind JSON body to ScanRequest struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	hostFilePath := "hosts.txt"
    hostFile, err := os.Create(hostFilePath)
    if err != nil {
        log.Fatalf("Failed to create file: %s", err)
    }
    defer hostFile.Close()


	var filenames []string // To collect filenames
	var mu sync.Mutex // To make appending to filenames slice thread-safe
	var wg sync.WaitGroup // To wait for all goroutines to finish

	// Iterate over IDs
	for i := range req.ID {
		wg.Add(1) // Increment the WaitGroup counter

		go func(idIndex int) {
			defer wg.Done() // Decrement the WaitGroup counter when the goroutine finishes

			defer func() {
				if r := recover(); r != nil {
					log.Printf("Recovered from panic while processing ID %s: %v", req.ID[idIndex], r)
				}
			}()
			objID, err := primitive.ObjectIDFromHex(req.ID[idIndex])
			if err != nil {
				log.Printf("Invalid ID format for ID %s\n", req.ID[idIndex])
				return
			}

			var result Template
			err = templatesCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&result)
			if err != nil {
				if err == mongo.ErrNoDocuments {
					log.Printf("Document not found for ID %s\n", req.ID[idIndex])
					return
				} else {
					log.Printf("Error fetching document for ID %s: %s\n", req.ID[idIndex], err.Error())
					return
				}
			}
			filename, err := createYAMLFile(result)
			if err != nil {
				log.Printf("Error creating YAML file for ID %s: %s\n", req.ID[idIndex], err.Error())
				return
			}

			mu.Lock() // Lock to prevent concurrent write to the slice
			filenames = append(filenames, filename) // Add filename to slice
			mu.Unlock() // Unlock after writing to the slice
		}(i)
	}

	wg.Wait() // Wait for all goroutines to finish

	// Join all filenames with comma
	templates := strings.Join(filenames, ",")

	for _, host := range req.Host {
		_, err := hostFile.WriteString(host + "\n")
		if err != nil {
			log.Fatalf("Failed to write to file: %s", err)
		}
	}
	go func() {
		startTime := time.Now().Unix()
		cveCountMap := make(map[string]int)

		history := History{
			PID:       req.PID, // front should pass the pid
			StartTime: startTime,    //  time stamp start
			EndTime:   int64(0),      //  time stamp end
			Result:    []string{},
			Status:    "status",
			CVECount:  cveCountMap,
		}
		id, err := scanResultsCollection.InsertOne(context.Background(), history)
		if err != nil {
			log.Printf("Error creating scan result for ID %s: %s", id, err.Error())
		}

		//_, err = folderCollection.InsertOne(context.Background(), id.InsertedID.(primitive.ObjectID))
		//if err != nil {
		//	log.Printf("Error creating scan result for ID %s: %s", id, err.Error())
		//}
		

		currentDir, err := os.Getwd() 
		if err != nil {
			log.Fatalf("Error getting current directory: %v", err)
		}

		nucleiPath := filepath.Join(currentDir, "services", "nuclei", "nuclei.exe")

		_, err = os.Stat(nucleiPath)
		if err != nil {
			if os.IsNotExist(err) {
				log.Fatalf("Nuclei executable does not exist at path: %s", nucleiPath)
			} else {
				log.Fatalf("Error checking file existence: %v", err)
			}
		}
		cmd := exec.Command(nucleiPath, "-t", templates, "-l", hostFilePath, "-hid", id.InsertedID.(primitive.ObjectID).Hex(), "-silent", "-j")
		output, err := cmd.CombinedOutput()

		if err != nil {
			log.Printf("Error running Nuclei scan: %v", err)
		}
		outputStr := parseNucleiOutput(string(output))

		log.Printf("nuclei Output:%s", output)

		CVECount := parseCVECount(string(output))

		cveCountMap["info"] = CVECount.Info
		cveCountMap["low"] = CVECount.Low
		cveCountMap["medium"] = CVECount.Medium
		cveCountMap["high"] = CVECount.High
		cveCountMap["critical"] = CVECount.Critical
		

		// Record the end time of the scan
		endTime := time.Now().Unix()

		status := "Complete"

		if err != nil {
			log.Printf("Error running Nuclei scan for ID %s: %s", id, err.Error())
			status = "Failed"
		}

		// Parse the output to get the CVE counts
		//cveCount := parseOutputToGetCVEs(output)  // You need to implement this function

		// Store the results in MongoDB
		after_scan := History{
			PID:       req.PID, // front should pass the pid
			StartTime: startTime,    //  time stamp start
			EndTime:   endTime,      //  time stamp end
			Result:    outputStr,
			Status:    status,
			CVECount:  cveCountMap,
		}
		
		filter := bson.M{"pid": history.PID}
		update := bson.M{
			"$set": bson.M{
				"endTime":  after_scan.EndTime,
				"result":   after_scan.Result,
				"status":   after_scan.Status,
				"cvecount": after_scan.CVECount,
			},
		}
		
		log.Printf("status: %s", status)
		
		_, err = scanResultsCollection.UpdateOne(context.Background(), filter, update)
		if err != nil {
			log.Printf("Error saving scan result for ID %s: %s", id, err.Error())
		}
		pidObjectID, err := primitive.ObjectIDFromHex(req.PID)
		if err != nil {
			log.Printf("Error converting PID to ObjectID: %s", err.Error())
			return
		}

		filter = bson.M{"project.pid": pidObjectID, "project.history": nil}
		update = bson.M{
			"$set": bson.M{
				"project.$[].history": []string{},
			},
		}
		_, err = folderCollection.UpdateOne(context.Background(), filter, update)

		filter = bson.M{"project": bson.M{"$elemMatch": bson.M{"pid": pidObjectID}}} // req.PID is the PID from FYP.History
		update = bson.M{
			"$push": bson.M{
				"project.$.history": id.InsertedID.(primitive.ObjectID),
			},
		}
		result, err := folderCollection.UpdateOne(context.Background(), filter, update)
		if err != nil {
			log.Printf("Error updating folder collection for ID %s: %s", id, err.Error())
		} else {
			log.Printf("Filter used in update: %v", filter)
			log.Printf("Update applied: %v", update)
			log.Printf("UpdateOne Result: Matched Count = %v, Modified Count = %v", result.MatchedCount, result.ModifiedCount)
		}

		os.Remove(hostFilePath)
		for _, filename := range filenames {
			err := os.Remove(filename)
			if err != nil {
				log.Printf("Failed to remove file %s: %s\n", filename, err)
			}
		}
	}()
	c.JSON(200, gin.H{"message": "Scan started"})

}

func createYAMLFile(template Template) (string, error) {
	// Convert the Template object to JSON
	jsonData, err := json.Marshal(template)
	if err != nil {
		return "", err
	}

	// Convert JSON to YAML
	yamlData, err := yaml.JSONToYAML(jsonData)
	if err != nil {
		return "", err
	}

	// Create a temp file
	tempFile, err := os.CreateTemp("", "template*.yaml")
	if err != nil {
		log.Fatal(err)
	}

	// Write the YAML data to the temp file
	if _, err := tempFile.Write(yamlData); err != nil {
		log.Fatal(err)
	}

	// Close the file
	if err := tempFile.Close(); err != nil {
		log.Fatal(err)
	}

	return tempFile.Name(), nil
}

func parseNucleiOutput(output string) []string {
    // A slice to hold the parsed results
    var results []string

    re := regexp.MustCompile("\x1b\\[[0-9;]*m")
    cleanOutput := re.ReplaceAllString(output, "")

    // Split the output into lines
    lines := strings.Split(cleanOutput, "\n")

    // Flag to check if any result is found
    var found bool

    // Regular expression to match timestamp at the beginning of a line
    timeRe := regexp.MustCompile(`^\d{4}/\d{2}/\d{2} \d{2}:\d{2}:\d{2}`)

    // Iterate over each line
    for _, line := range lines {
        // Skip empty lines and lines starting with a timestamp
        if len(line) == 0 || timeRe.MatchString(line) {
            continue
        }

        // Split the line into parts
        parts := strings.Split(line, " ")

        // Check if the line has at least 4 parts
        if len(parts) >= 5 {
            // Add the 4th and 5th parts to the results slice
            results = append(results, parts[3]+" "+parts[4])
            found = true
        } else if len(parts) >= 4 {
            // Add the 4th part to the results slice
            results = append(results, parts[3])
            found = true
        }
    }

    // Check if any result is found. If not, add "No results found."
    if !found {
        results = append(results, "No results found.")
    }

    // Return the slice of results
    return results
}

func parseCVECount(output string) CVECount {
    re := regexp.MustCompile("\x1b\\[[0-9;]*m")
    cleanOutput := re.ReplaceAllString(output, "")

    var cveCount CVECount

    lines := strings.Split(cleanOutput, "\n")

    for _, line := range lines {
        if len(line) == 0 {
            continue
        }

        parts := strings.Split(line, " ")

        // Skip lines that don't have enough parts to hold the severity level
        if len(parts) < 4 {
            continue
        }

        // The severity level is the fourth part in the line
        severity := parts[2]

        // Increment the corresponding severity level count in the CVECount object
        switch severity {
        case "[info]":
            cveCount.Info++
        case "[low]":
            cveCount.Low++
        case "[medium]":
            cveCount.Medium++
        case "[high]":
            cveCount.High++
        case "[critical]":
            cveCount.Critical++
        }
    }

    return cveCount
}




func ScanSummary(c *gin.Context, pid string) {
    filter := bson.M{"pid": pid}
    options := options.FindOne().SetSort(bson.M{"endtime": -1}) // sorts in descending order by endtime

    var result History // replace with your actual History struct

    err := scanResultsCollection.FindOne(context.Background(), filter, options).Decode(&result)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            // Handle no document found
            log.Printf("No document was found with pid: %v", pid)
            c.JSON(404, gin.H{"message": "No document found"})
            return
        } else {
            // Handle other errors
            log.Printf("An error occurred: %v", err)
            c.JSON(500, gin.H{"message": "Internal server error"})
            return
        }
    }

    // Send the result back to the client
    c.JSON(200, result)
}

//
func GetScanResultSummary(c *gin.Context, pid string) {
    // Convert the pid string to an ObjectID
    pidOid, err := primitive.ObjectIDFromHex(pid)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pid format"})
        return
    }

    // Create a pipeline to extract the history IDs for the given pid
    pipeline := mongo.Pipeline{
        bson.D{{Key: "$unwind", Value: "$project"}},
        bson.D{{Key: "$match", Value: bson.D{{Key: "project.pid", Value: pidOid}}}},
        bson.D{{Key: "$project", Value: bson.D{{Key: "history", Value: "$project.history"}}}},
    }

    // Run the pipeline
    cur, err := folderCollection.Aggregate(context.Background(), pipeline)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error executing pipeline"})
        return
    }
    defer cur.Close(context.Background())

    // Parse the results
    var results []bson.M
    if err := cur.All(context.Background(), &results); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading pipeline results"})
        return
    }

    // For each history ID, fetch the corresponding document from the scanResultsCollection
    var histories []bson.M
for _, result := range results {
    for _, historyOid := range result["history"].(primitive.A) {
        var historyDoc bson.M

        // Create a pipeline to extract only the desired fields
        historyPipeline := mongo.Pipeline{
            bson.D{{Key: "$match", Value: bson.D{{Key: "_id", Value: historyOid}}}},
            bson.D{{Key: "$project", Value: bson.D{
                {Key: "result.info.name", Value: 1},
                {Key: "result.info.severityholder", Value: 1},
                {Key: "result.matchername", Value: 1},
                {Key: "result.extractorname", Value: 1},
                {Key: "result.host", Value: 1},
                {Key: "result.matched", Value: 1},
                {Key: "result.extractedresults", Value: 1},
                {Key: "result.ip", Value: 1},
                {Key: "result.timestamp", Value: 1},
                {Key: "status", Value: 1},
                {Key: "cvecount", Value: 1},
            }}},
        }

        // Run the pipeline
        historyCur, err := scanResultsCollection.Aggregate(context.Background(), historyPipeline)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error executing history pipeline"})
            return
        }
        defer historyCur.Close(context.Background())

        // Parse the result
        if err := historyCur.All(context.Background(), &historyDoc); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading history pipeline results"})
            return
        }

        histories = append(histories, historyDoc)
    }
}

// Return the histories as JSON
c.JSON(http.StatusOK, histories)
}

func GetScanHistory(c *gin.Context) {
    // Create a pipeline to extract all unique pids
    pipeline := mongo.Pipeline{
        bson.D{{Key: "$group", Value: bson.D{{Key: "_id", Value: "$pid"}}}},
    }

    // Run the pipeline
    cur, err := scanResultsCollection.Aggregate(context.Background(), pipeline)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error executing pipeline"})
        return
    }
    defer cur.Close(context.Background())

    // Parse the results
    var results []bson.M
    if err := cur.All(context.Background(), &results); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading pipeline results"})
        return
    }

    // Extract the pids into a slice
    var pids []primitive.ObjectID
    for _, result := range results {
        if pid, ok := result["_id"].(primitive.ObjectID); ok {
            pids = append(pids, pid)
        }
    }

    // Return the pids as JSON
    c.JSON(http.StatusOK, pids)
}