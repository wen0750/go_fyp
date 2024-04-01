package templates

import (
	"context"
	"encoding/json"
	"fmt"
	"go_fyp/core/backend/services/database"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/yaml.v2"
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
			Regex     []string `json:"regex,omitempty"`
			Part string   `json:"part,omitempty"`
			Words     []string `json:"words,omitempty"`
			Dsl       []string `json:"dsl,omitempty"`
			Condition string   `json:"condition,omitempty"`
			Status    []int    `json:"status,omitempty"`
		} `json:"extractors,omitempty"`
	} `json:"http,omitempty"`
	Local int `json:"local,omitempty"`
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

func MoveYAMLFilesToDB(srcDir string) error {
	return filepath.Walk(srcDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Println("Error accessing path:", path, err)
			return err
		}

		// Skip directories
		if info.IsDir() {
			return nil
		}

		if filepath.Ext(path) == ".yaml" {
			fmt.Printf("Processing file: %s\n", path)

			// Read the YAML file
			yamlData, err := os.ReadFile(path)
			if err != nil {
				log.Println("Error reading file:", err)
				return nil // Continue with the next file
			}

			// Parse YAML file into Template struct
			var tmpl Template
			err = yaml.Unmarshal(yamlData, &tmpl)
			if err != nil {
				log.Println("Error unmarshaling YAML:", err)
				return nil // Continue with the next file
			}

			// Convert struct to JSON
			jsonData, err := json.Marshal(tmpl)
			if err != nil {
				log.Println("Error marshaling JSON:", err)
				return nil // Continue with the next file
			}

			// Save to DB
			err = saveToDB(templatesCollection, jsonData)
			if err != nil {
				log.Println("Error saving to DB:", err)
				return nil // Continue with the next file
			}

			fmt.Printf("Saved template with ID: %s\n", tmpl.ID)
		}

		return nil
	})
}

func saveToDB(collection *mongo.Collection, jsonData []byte) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var tmpl Template
	if err := json.Unmarshal(jsonData, &tmpl); err != nil {
		log.Printf("Error unmarshaling JSON data into Template struct: %v", err)
		return err
	}

	// Create a filter for an existing document with the same ID
	filter := bson.M{"id": tmpl.ID}
	// Convert the struct to BSON for the update
	update := bson.M{"$set": tmpl}
	// Set the upsert option to true - this creates a new document if one does not exist
	opts := options.Update().SetUpsert(true)

	// Update an existing document or insert a new one if it doesn't exist
	_, err := collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		log.Printf("Error upserting BSON data into MongoDB: %v", err)
		return err
	}

	log.Printf("Upserted template with ID: %s", tmpl.ID)
	return nil
}
