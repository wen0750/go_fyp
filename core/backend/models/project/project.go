package project

import (
	"context"
	"encoding/json"
	"fmt"
	"go_fyp/core/backend/services/database"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
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
	StartTime int64              `bson:"startTime"`
	EndTime   int64              `bson:"endTime"`
	Result    []string           `bson:"result"`
	Status    string             `bson:"status"`
	CVECount  map[string]int     `bson:"cvecount"`
}
type HistoryEntry struct {
	ID        string `json:"_id" bson:"_id,omitempty"`
	StartTime int64  `json:"startTime" bson:"startTime,omitempty"`
	EndTime   int64  `json:"endTime" bson:"endTime,omitempty"`
	Status    string `json:"status" bson:"status,omitempty"`
}

type InputCreateProject struct {
	Name string   `json:"name"`
	Fid  string   `json:"fid"`
	Host []string `json:"host"`
	Poc  []string `json:"poc"`
}

type InputUpdateProject struct {
	Fid  string             `json:"fid"` // for finding
	Pid  primitive.ObjectID `json:"pid"`
	Name string             `json:"name"`
	Host []string           `json:"host"`
	Poc  []string           `json:"poc"`
}

type Folder struct {
	Name     string        `json:"name"`
	Project  []ProjectItem `json:"project"`
	Status   string        `json:"status"`
	Lastscan int           `json:"lastscan"`
	Ownerid  int           `json:"ownerid"`
}

type ProjectItem struct {
	Pid      primitive.ObjectID `json:"pid"`
	Name     string             `json:"name"`
	Host     []string           `json:"host"`
	Poc      []string           `json:"poc"`
	History  []string           `json:"history"`
	LastScan int                `json:"lastscan"`
	Schedule string             `json:"schedule"`
	Status   string             `json:"status"`
}

// From 127.0.0.1:8888/project/startScan
type ScanRequest struct {
	ID   []string `json:"ID"`
	PID  string   `json:"PID"`
	Host []string `json:"host"`
}

// for delete
type InputDeleteProject struct {
	Fid string `json:"fid"`
	//RowId string  `json:"rowId"`
	Pid string `json:"pid"`
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
			MaxRequest  int    `json:"max-request,omitempty"`
		} `json:"metadata,omitempty"`

		Tags string `json:"tags,omitempty"`
	} `json:"info,omitempty"`

	Variables map[string]interface{} `json:"variables,omitempty"`

	HTTP []struct {
		Method            string            `json:"method,omitempty"`
		Path              []string          `json:"path,omitempty"`
		Raw               []string          `json:"raw,omitempty"`
		Payloads          map[string]string `json:"payloads,omitempty"`
		Threads           int               `json:"threads,omitempty"`
		StopAtFirstMatch  bool              `json:"stop-at-first-match,omitempty"`
		MatchersCondition string            `json:"matchers-condition,omitempty"`
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
			Type string   `json:"type,omitempty"`
			Name string   `json:"name,omitempty"`
			Json []string `json:"json,omitempty"`
			Part string   `json:"part,omitempty"`
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

	var primary_id = primitive.NewObjectID()
	var newProject = ProjectItem{primary_id, inputData.Name, inputData.Host, inputData.Poc, []string{}, 1000, "onDemand", "idle"}

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

func UpdateProject(c *gin.Context) {
	var inputData InputUpdateProject

	if err := c.ShouldBindJSON(&inputData); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := updateProjectInFolder(inputData, inputData.Fid)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{
			"action": "updated",
			"result": result,
		})
	}
}

func updateProjectInFolder(inputData InputUpdateProject, fid string) (bson.M, error) {
	var result bson.M

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Convert fid from string to ObjectID
	parentObjID, err := primitive.ObjectIDFromHex(fid)
	if err != nil {
		return nil, err // Invalid ObjectID for the parent document
	}

	// inputData.Pid is already of type primitive.ObjectID, so no conversion is needed.

	filter := bson.M{
		"_id":         parentObjID,
		"project.pid": inputData.Pid, // Use the correct field name here.
	}

	// Build the update document using the positional operator `$`.
	update := bson.M{
		"$set": bson.M{
			"project.$.name": inputData.Name, // Use the correct field name here.
			"project.$.host": inputData.Host,
			"project.$.poc":  inputData.Poc,
			// Include other fields as necessary.
		},
	}

	err = folderCollection.FindOneAndUpdate(ctx, filter, update).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, err // No document found
		}
		// Some other error occurred
		return nil, err
	}

	return result, nil
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
	var mu sync.Mutex      // To make appending to filenames slice thread-safe
	var wg sync.WaitGroup  // To wait for all goroutines to finish

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

			mu.Lock()                               // Lock to prevent concurrent write to the slice
			filenames = append(filenames, filename) // Add filename to slice
			mu.Unlock()                             // Unlock after writing to the slice
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
			PID:       req.PID,   // front should pass the pid
			StartTime: startTime, //  time stamp start
			EndTime:   int64(0),  //  time stamp end
			Result:    []string{},
			Status:    "Scanning",
			CVECount:  cveCountMap,
		}
		id, err := scanResultsCollection.InsertOne(context.Background(), history)
		if err != nil {
			log.Printf("Error creating scan result for ID %s: %s", id, err.Error())
		}

		pidObjectID, err := primitive.ObjectIDFromHex(req.PID)
		if err != nil {
			log.Printf("Error converting PID to ObjectID: %s", err.Error())
			return
		}

		filter := bson.M{"project": bson.M{"$elemMatch": bson.M{"pid": pidObjectID}}}
		update := bson.M{
			"$set": bson.M{
				"project.$.status": "scanning",
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
				log.Printf("Nuclei executable does not exist at path: %s", nucleiPath)
			} else {
				log.Printf("Error checking file existence: %v", err)
			}
		}
		cmd := exec.Command(nucleiPath, "-t", templates, "-l", hostFilePath, "-hid", id.InsertedID.(primitive.ObjectID).Hex(), "-silent", "-j", "-nc")
		fmt.Println("Command to be executed:\n", cmd.String())

		output, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Println("Error executing command:", err)
			return
		}

		outputLines := strings.Split(string(output), "\n")

		var combinedCVECount CVECount
		for _, line := range outputLines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "{") && strings.HasSuffix(line, "}") {
				// Parse this JSON line
				cveCount, err := parseCVECount(line)
				if err != nil {
					// Handle the JSON parsing error appropriately
					fmt.Printf("Error parsing CVE count from line: %s\nError: %s\n", line, err)
					// Decide if you want to continue processing other lines or return
					continue
				}

				// Combine the counts from each line
				combinedCVECount.Info += cveCount.Info
				combinedCVECount.Low += cveCount.Low
				combinedCVECount.Medium += cveCount.Medium
				combinedCVECount.High += cveCount.High
				combinedCVECount.Critical += cveCount.Critical
			}
		}

		log.Printf("Final combined CVE count: %+v", combinedCVECount)

		cveCountMap["info"] = combinedCVECount.Info 			//1
		cveCountMap["low"] = combinedCVECount.Low 				//2
		cveCountMap["medium"] = combinedCVECount.Medium			//3
		cveCountMap["high"] = combinedCVECount.High				//4
		cveCountMap["critical"] = combinedCVECount.Critical		//5

		filter = bson.M{"_id": id.InsertedID}
		update = bson.M{
			"$set": bson.M{
				"cvecount": cveCountMap,
			},
		}
		EndTime := time.Now().Unix()

		updateResult, err := scanResultsCollection.UpdateOne(context.Background(), filter, update)
		if err != nil {
			log.Printf("Error saving scan result for ID %s: %s", id, err.Error())
		} else {
			log.Printf("Update Result: Matched Count = %d, Modified Count = %d", updateResult.MatchedCount, updateResult.ModifiedCount)
		}

		//filter = bson.M{"project.pid": pidObjectID, "project.history": nil}
		//update = bson.M{
		//	"$set": bson.M{
		//		"project.$[].history": []string{},
		//	},
		//}
		//_, err = folderCollection.UpdateOne(context.Background(), filter, update)

		filter = bson.M{"project": bson.M{"$elemMatch": bson.M{"pid": pidObjectID}}} // req.PID is the PID from FYP.History
		update = bson.M{
			"$push": bson.M{
				"project.$.history": id.InsertedID.(primitive.ObjectID),
			},
			"$set": bson.M{
				"project.$.lastscan": EndTime,
				"lastscan":           EndTime,
				"project.$.status":   "idle",
			},
		}
		result, err = folderCollection.UpdateOne(context.Background(), filter, update)
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

func parseCVECount(jsonData string) (CVECount, error) {

	var scanResult struct {
		Info struct {
			Severity string `json:"severity"`
		} `json:"info"`
	}
	var counts CVECount

	err := json.Unmarshal([]byte(jsonData), &scanResult)
	if err != nil {
		log.Printf("Error unmarshalling JSON: %v", err)
		return counts, err
	}

	// Map string severity to count
	switch strings.ToLower(scanResult.Info.Severity) {
	case "info":
		counts.Info++
	case "low":
		counts.Low++
	case "medium":
		counts.Medium++
	case "high":
		counts.High++
	case "critical":
		counts.Critical++
	}
	return counts, nil
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
			// Create a slice of maps to hold multiple documents
			var historyDocs []bson.M

			// Create a pipeline to extract only the desired fields
			historyPipeline := mongo.Pipeline{
				bson.D{{Key: "$match", Value: bson.D{{Key: "_id", Value: historyOid}}}},
				bson.D{{Key: "$project", Value: bson.D{
					{Key: "result.info.name", Value: 1},
					{Key: "result.info.severityholder.severity", Value: 1},
					{Key: "result.info.classification.cvssscore", Value: 1},
					{Key: "result.matchername", Value: 1},
					{Key: "result.extractorname", Value: 1},
					{Key: "result.host", Value: 1},
					{Key: "result.matched", Value: 1},
					{Key: "result.extractedresults", Value: 1},
					{Key: "result.ip", Value: 1},
					{Key: "result.request", Value: 1},
					{Key: "result.response", Value: 1},
					{Key: "result.metadata", Value: 1},
					{Key: "result.matcherstatus", Value: 1},
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
			if err := historyCur.All(context.Background(), &historyDocs); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error reading history pipeline results: %v", err)})
				return
			}

			// Append the history documents to the histories slice
			histories = append(histories, historyDocs...)
		}
	}

	// Return the histories as JSON
	c.JSON(http.StatusOK, histories)
}

func GetLatestScanResultSummary(c *gin.Context, pid string) {
	objID, err := primitive.ObjectIDFromHex(pid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid PID format"})
		return
	}

	// Define the aggregation pipeline to get the latest history item
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.M{"project.pid": objID}}},
		{{Key: "$unwind", Value: "$project"}},
		{{Key: "$match", Value: bson.M{"project.pid": objID}}},
		{{Key: "$unwind", Value: "$project.history"}},
		{{Key: "$sort", Value: bson.M{"project.history": -1}}},
		{{Key: "$limit", Value: 1}},
		{{Key: "$project", Value: bson.M{"latestHistoryId": "$project.history"}}},
	}

	cursor, err := folderCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var results []bson.M
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if len(results) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No history record found"})
		return
	}

	// Extract the latestHistoryId
	var latestHistoryId primitive.ObjectID
	if idDoc, ok := results[0]["latestHistoryId"].(primitive.D); ok {
		latestHistoryId = idDoc.Map()["_id"].(primitive.ObjectID)
	} else {
		latestHistoryId, ok = results[0]["latestHistoryId"].(primitive.ObjectID)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unexpected type for latestHistoryId"})
			return
		}
	}

	// Define the projection for the history record
	projection := bson.D{
		{Key: "result.info.name", Value: 1},
		{Key: "result.info.description", Value: 1},
		{Key: "result.info.severityholder.severity", Value: 1},
		{Key: "result.info.classification.cvssscore", Value: 1},
		{Key: "result.matchername", Value: 1},
		{Key: "result.extractorname", Value: 1},
		{Key: "result.host", Value: 1},
		{Key: "result.matched", Value: 1},
		{Key: "result.extractedresults", Value: 1},
		{Key: "result.ip", Value: 1},
		{Key: "result.request", Value: 1},
		{Key: "result.response", Value: 1},
		{Key: "result.metadata", Value: 1},
		{Key: "result.matcherstatus", Value: 1},
		{Key: "startTime", Value: 1},
		{Key: "endTime", Value: 1},
		{Key: "status", Value: 1},
		{Key: "cvecount", Value: 1},
	}

	// Fetch the latest scan result from the 'History' collection with the selected fields
	var historyRecord bson.M
	if err := scanResultsCollection.FindOne(
		context.Background(),
		bson.M{"_id": latestHistoryId},
		options.FindOne().SetProjection(projection),
	).Decode(&historyRecord); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, historyRecord)
}

func GetScanResultByHistoryId(c *gin.Context, hid string) {
	historyObjID, err := primitive.ObjectIDFromHex(hid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid History ID format"})
		return
	}

	// Define the projection for the history record
	projection := bson.D{
		{Key: "result.info.name", Value: 1},
		{Key: "result.info.description", Value: 1},
		{Key: "result.info.severityholder.severity", Value: 1},
		{Key: "result.matchername", Value: 1},
		{Key: "result.extractorname", Value: 1},
		{Key: "result.host", Value: 1},
		{Key: "result.matched", Value: 1},
		{Key: "result.extractedresults", Value: 1},
		{Key: "result.ip", Value: 1},
		{Key: "result.request", Value: 1},
		{Key: "result.response", Value: 1},
		{Key: "result.metadata", Value: 1},
		{Key: "result.matcherstatus", Value: 1},
		{Key: "startTime", Value: 1},
		{Key: "endTime", Value: 1},
		{Key: "status", Value: 1},
		{Key: "cvecount", Value: 1},
	}

	// Fetch the scan result from the 'History' collection with the selected fields
	var historyRecord bson.M
	if err := scanResultsCollection.FindOne(
		context.Background(),
		bson.M{"_id": historyObjID},
		options.FindOne().SetProjection(projection),
	).Decode(&historyRecord); err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "History record not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, historyRecord)
}

func GetScanHistoryList(c *gin.Context, pid string) {
	// Convert pid to ObjectID
	pidObjID, err := primitive.ObjectIDFromHex(pid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid PID"})
		return
	}

	// Define the fields to be returned
	projection := bson.D{
		{Key: "_id", Value: 1},
		{Key: "startTime", Value: 1},
		{Key: "endTime", Value: 1},
		{Key: "status", Value: 1},
	}

	// Query the database to get the "history" list
	var folder struct {
		Project []struct {
			PID     primitive.ObjectID   `bson:"pid"`
			History []primitive.ObjectID `bson:"history"`
		} `bson:"project"`
	}

	err = folderCollection.FindOne(
		context.TODO(),
		bson.M{"project.pid": pidObjID},
	).Decode(&folder)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying database for pid"})
		return
	}

	// Iterate over the projects and collect history IDs if pid matches
	var historyIDs []primitive.ObjectID
	for _, project := range folder.Project {
		if project.PID == pidObjID {
			historyIDs = append(historyIDs, project.History...)
		}
	}

	// Query the database for history records
	cursor, err := scanResultsCollection.Find(
		context.TODO(),
		bson.M{"_id": bson.M{"$in": historyIDs}},
		options.Find().SetProjection(projection),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying database for history"})
		return
	}
	defer cursor.Close(context.TODO())

	// Iterate the cursor and decode each item into a History struct
	var results []*HistoryEntry
	for cursor.Next(context.TODO()) {
		var elem HistoryEntry
		err := cursor.Decode(&elem)
		if err != nil {
			log.Println(err)
		}
		results = append(results, &elem)
	}

	if err := cursor.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating cursor"})
		return
	}

	// Return the results
	c.JSON(http.StatusOK, results)
}
