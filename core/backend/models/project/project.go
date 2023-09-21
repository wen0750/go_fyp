package project

import (
	"context"
	"encoding/json"
	"go_fyp/core/backend/services/database"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strings"
	"time"

	"log"

	"github.com/ghodss/yaml"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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
		//
		Classification struct {
			CvssMetrics string  `json:"cvss-metrics,omitempty"`
			CvssScore   float64 `json:"cvss-score,omitempty"`
			CveID       string  `json:"cve-id,omitempty"`
			CweID       string  `json:"cwe-id,omitempty"`
		} `json:"classification,omitempty"`
		//
		Metadata struct {
			Verified    bool   `json:"verified,omitempty"`
			ShodanQuery string `json:"shodan-query,omitempty"`
			MaxRequest int `json:"max-request,omitempty"`
		} `json:"metadata,omitempty"`
		//
		Tags string `json:"tags,omitempty"`
	} `json:"info,omitempty"`
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
		//
		Extractors []struct {
			Type  string   `json:"type,omitempty"`
			Name  string   `json:"name,omitempty"`
			Json  []string `json:"json,omitempty"`
			Part  string   `json:"part,omitempty"`
		} `json:"extractors,omitempty"`
	} `json:"http,omitempty"`
	Requests []struct {
		Raw               []string `json:"raw,omitempty"`
		CookieReuse       bool     `json:"cookie-reuse,omitempty"`
		Method            string   `json:"method,omitempty"`
		Path              []string `json:"path,omitempty"`
		Redirects         bool     `json:"redirects,omitempty"`
		MaxRedirects      int      `json:"max-redirects,omitempty"`
		StopAtFirstMatch  bool     `json:"stop-at-first-match,omitempty"`
		MatchersCondition string   `json:"matchers-condition,omitempty"`
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
		//
		Extractors []struct {
			Type  string   `json:"type,omitempty"`
			Name  string   `json:"name,omitempty"`
			Group int      `json:"group,omitempty"`
			Regex []string `json:"regex,omitempty"`
		} `json:"extractors,omitempty"`
	} `json:"requests,omitempty"`
	//
	Workflows []struct {
		Template string `json:"template,omitempty"`
		//
		Subtemplates []struct {
			Tags string `json:"tags,omitempty"`
		} `json:"subtemplates,omitempty"`
	} `json:"workflows,omitempty"`
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

func ProjectCreateHandeler(c *gin.Context) {
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
	var newProject = ProjectItem{primary_id, inputData.Name, inputData.Host, poc, 1000, "onDemand", "idle"}

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

func removeANSISequences(str string) string {
	re := regexp.MustCompile(`\x1B\[[0-?]*[ -/]*[@-~]\\`)
	return re.ReplaceAllString(str, "")
}


func StartScan(c *gin.Context) {
	var req ScanRequest

	// Bind JSON body to ScanRequest struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Iterate over IDs
	for i := range req.ID {
		// Iterate over hosts for each ID
		for j := range req.Host {
			go func(idIndex int, hostIndex int) {
				defer func() {
					if r := recover(); r != nil {
						log.Printf("Recovered from panic while processing ID %s: %v", req.ID[idIndex], r)
					}
				}()

				// Convert string ID to ObjectID
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

				// Record the start time of the scan
				startTime := time.Now().Unix()

				// Run the Nuclei scan - using req.Host[hostIndex]
				cmd := exec.Command("nuclei", "-t", filename, "-u", req.Host[hostIndex], "-silent")
				output, err := cmd.CombinedOutput()
				outputStr := parseNucleiOutput(string(output))

				CVECount := parseCVECount(string(output))
				

				// Record the end time of the scan
				endTime := time.Now().Unix()

				status := "Complete"

				if err != nil {
					log.Printf("Error running Nuclei scan for ID %s: %s", req.ID[idIndex], err.Error())
					log.Printf("Nuclei output: %s", outputStr)
					status = "Failed"
				}

				// Parse the output to get the CVE counts
				//cveCount := parseOutputToGetCVEs(output)  // You need to implement this function

				// Store the results in MongoDB
				history := History{
					PID:       req.PID, // front should pass the pid
					StartTime: startTime,    //  time stamp start
					EndTime:   endTime,      //  time stamp end
					Result:    outputStr,
					Status:    status,
					CVECount:  CVECount,
				}

				_, err = scanResultsCollection.InsertOne(context.Background(), history)
				if err != nil {
					log.Printf("Error saving scan result for ID %s: %s", req.ID[idIndex], err.Error())
				}

				// Delete the file after scanning
				os.Remove(filename)
			}(i, j)
		}
	}

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

    // Split the output into lines
    lines := strings.Split(output, "\n")

    // Flag to check if any result is found
    var found bool

    // Iterate over each line
    for _, line := range lines {
        // Skip empty lines
        if len(line) == 0 {
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

func parseCVECount(output string) map[string]int {
    // risk level
    results := map[string]int{
        "info": 0,
        "low": 0,
        "medium": 0,
        "high": 0,
        "critical": 0,
    }

    // Split the output into lines
    lines := strings.Split(output, "\n")

    for _, line := range lines {
        // Skip empty lines
        if len(line) == 0 {
            continue
        }

        parts := strings.Split(line, " ")

        // Check if the line has at least 3 parts
        if len(parts) >= 3 {
            // Increase the count of the third part in the map
            if _, ok := results[parts[2]]; ok {
                results[parts[2]]++
            }
        }
    }

    // Return the map of results
    return results
}


func ScanSummary(c *gin.Context) {

}

func GetScanResult(c *gin.Context) {

}
