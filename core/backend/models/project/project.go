package project

import (
	"context"
	"encoding/json"
	"go_fyp/core/backend/services/database"
	"net/http"
	"os"
	"os/exec"
	"regexp"
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
	CVECount  []string           `bson:"cvecount"`
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
	Project  []string `json:"project"`
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
	ID string `json:"ID"`
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
		} `json:"metadata,omitempty"`
		//
		Tags string `json:"tags,omitempty"`
	} `json:"info,omitempty"`
	//
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

func RemoveProjectFromFolder() {

}

func GetPOEList() {

}

func StartScan(c *gin.Context) {
	var req ScanRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Convert string ID to ObjectID
	objID, err := primitive.ObjectIDFromHex(req.ID)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID format"})
		return
	}

	var result Template
	err = templatesCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(404, gin.H{"exists": false})
			return
		} else {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
	}
	// Create a temp file, Write the template to it for scanning, delete it after finish scanning
	filename, err := createYAMLFile(result)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	go func() {
		// Record the start time of the scan
		startTime := time.Now().Unix()

		cmd := exec.Command("nuclei", "-t", filename, "-u", "wp1.wen0750.club", "-j")
		rawOutput, err := cmd.CombinedOutput()

		// Remove all ANSI escape sequences from the output
        output := removeANSISequences(string(rawOutput))

		// Record the end time of the scan
		endTime := time.Now().Unix()

		status := "Complete"

		if err != nil {
			log.Printf("Error running Nuclei scan: %s", err.Error())
			log.Printf("Nuclei output: %s", output)
			status = "Failed"
		}
		log.Printf("%s", output)
		// Parse the output to get the CVE counts
		//cveCount := parseOutputToGetCVEs(output)  // You need to implement this function

		// Store the results in MongoDB
		history := History{
			PID:       "project_id",  // front should pass the pid
			StartTime: startTime,       //  time stamp start 
			EndTime:   endTime,       //  time stamp end
			Result:    []string{output},
			Status:    status,
			CVECount:  []string{"CVE-2021-1234"}, // for testing
		}
		
		_, err = scanResultsCollection.InsertOne(context.Background(), history)
		if err != nil {
			log.Printf("Error saving scan result: %s", err.Error())
		}
		// Delete the file after scanning
		os.Remove(filename)
	}()

	c.JSON(200, gin.H{"data": result, "file": filename, "message": "Scan started"})
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

func removeANSISequences(str string) string {
	re := regexp.MustCompile(`\x1B\[[0-?]*[ -/]*[@-~]`)
	return re.ReplaceAllString(str, "")
}

func GetScanResult(c *gin.Context) {

}