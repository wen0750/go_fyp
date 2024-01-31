package templates

import (
	"context"
	"go_fyp/core/backend/services/database"
	"net/http"

	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// templates/getTemplatesDetails
type RequestTemplatesDetails struct {
	ID string `json:"_id"`
}

// For finding
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

func GetTemplatesList(c *gin.Context) {
	var templates []bson.M

	// Create a projection to select only the _id, id and info.name fields
	projection := bson.M{
		"_id":       1, // Include the _id field
		"id":        1, // Include the id field
		"info.name": 1, // Include the info.name field
	}

	// Fetch documents from the "templates" collection with the projection
	cursor, err := templatesCollection.Find(context.Background(), bson.M{}, options.Find().SetProjection(projection))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.Background())

	// Decode documents into `templates`
	if err := cursor.All(context.Background(), &templates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the templates
	c.JSON(http.StatusOK, templates)
}

func GetTemplatesDetails(c *gin.Context) {
	var requestBody RequestTemplatesDetails
	var templates bson.M

	// Bind the JSON to your struct
	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Convert the string _id to a MongoDB ObjectID
	objectID, err := primitive.ObjectIDFromHex(requestBody.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// Find the document with the specified _id
	err = templatesCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&templates)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Return the template
	c.JSON(http.StatusOK, templates)
}
