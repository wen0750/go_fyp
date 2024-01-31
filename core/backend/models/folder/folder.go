package folder

import (
	"context"
	"go_fyp/core/backend/services/database"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type InputCreateFolder struct {
	Name string `json:"name"`
}
type InputRemoveFolder struct {
	ID string `json:"id"`
}
type InputGetFolder struct {
	Fid string `json:"fid"`
}

type Folder struct {
	Name     string   `json:"name"`
	Project  []string `json:"project"`
	Status   string   `json:"status"`
	Lastscan int      `json:"lastscan"`
	Ownerid  int      `json:"ownerid"`
}

type Project struct {
	Pid     string   `json:"pid"`
	Host    []string `json:"host"`
	History []string `json:"history"`
}

type CVE struct {
	ID        int    `bson:"id"`
	LastName  string `bson:"lastName"`
	FirstName string `bson:"firstName"`
	Age       string `bson:"age"`
	Tid       string `bson:"tid"`
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

var folderCollection *mongo.Collection
var templatesCollection *mongo.Collection

func init() {
	var err error

	folderCollection, err = database.InitializeMongoDB("Folder")
	if err != nil {
		log.Fatalf("Error initializing MongoDB Folders collection: %v\n", err)
	} else {
		log.Println("MongoDB (folder) initialized successfully")
	}

	templatesCollection, err = database.InitializeMongoDB("Templates")
	if err != nil {
		log.Fatalf("Error initializing MongoDB Templates collection: %v\n", err)
	} else {
		log.Println("MongoDB (Templates) initialized successfully")
	}
}

func GetFolderDetail(c *gin.Context) {
	var inputData InputGetFolder

	// ---> 绑定数据
	if err := c.ShouldBindJSON(&inputData); err != nil {
		// c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()})
		return
	}

	if inputData.Fid == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "empty input"})
		return
	}

	// Convert the string ID to an ObjectID
	objectID, err := primitive.ObjectIDFromHex(inputData.Fid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// Retrieve all documents from the collection

	cursor, err := folderCollection.Find(context.Background(), bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing folder"})
		return
	}
	defer cursor.Close(context.Background())

	// Iterate through the returned cursor.
	var results []bson.M
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing folder"})
		return
	}

	c.JSON(http.StatusOK, results)
}

func GetFolderList(c *gin.Context) {
	// Retrieve all documents from the collection
	cursor, err := folderCollection.Find(context.Background(), bson.D{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing folder"})
		return
	}
	defer cursor.Close(context.Background())

	// Iterate through the returned cursor.
	var results []bson.M
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing folder"})
		return
	}

	c.JSON(http.StatusOK, results)
}

func CreateFolder(c *gin.Context) {
	var inputData InputCreateFolder

	// ---> 绑定数据
	if err := c.ShouldBindJSON(&inputData); err != nil {
		// c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()})
		return
	}

	if inputData.Name == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "empty input"})
		return
	}

	var pj = []string{}
	var folderObject = Folder{inputData.Name, pj, "emo", 0, 0}

	// Insert the folder into the collection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := folderCollection.InsertOne(ctx, folderObject)
	if err != nil {

		// gin.H{"error": err.Error()}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Folder created successfully"})
}

func RemoveFolder(c *gin.Context) {
	var folder InputRemoveFolder

	// Decode the JSON request body into the Folder struct
	if err := c.ShouldBindJSON(&folder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Convert the string ID to an ObjectID
	objectID, err := primitive.ObjectIDFromHex(folder.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// Delete the folder from the collection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = folderCollection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove folder"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Folder removed successfully"})
}

func ViewFolderItem() {
	//a function that show the Folder content
}
