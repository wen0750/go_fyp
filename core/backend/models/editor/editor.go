package editor

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/yaml.v3"

	"go_fyp/core/backend/services/database"
)

// create a template structure
type Template struct {
	ID   string `json:"id"`
	Info struct {
		Name        string   `json:"name,omitempty"`
		Author      string   `json:"author,omitempty"`
		Severity    string   `json:"severity,omitempty"`
		Description string   `json:"description,omitempty"`
		Remediation string   `json:"remediation,omitempty"`
		Reference   []string `json:"reference,omitempty"`
		Impact 		string	 `json:"impact,omitempty"`

		Classification struct {
			CvssMetrics string  `json:"cvss-metrics,omitempty"`
			CvssScore   float64 `json:"cvss-score,omitempty"`
			Cpe 		string  `json:"cpe,omitempty"`
			EpssScore  float64  `json:"epss-score,omitempty"`
			EpssPercentile  string  `json:"epss-percentile,omitempty"`
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

var collection *mongo.Collection

func init() {
	connection, err := database.InitializeMongoDB("Templates")
	if err != nil {
		log.Fatalf("Error initializing MongoDB Folders collection: %v\n", err)
	} else {
		collection = connection
		log.Println("MongoDB (Templates) initialized successfully")
	}
}

// receive raw json data and convert it into .yaml file
func Download(c *gin.Context) {
	//receive data from website with POST method
	jsonData := Template{}
	c.BindJSON(&jsonData)
	//For checking
	fmt.Printf("JSON data: %v\n", gin.H{
		"id":     jsonData.ID,
		"\ninfo": jsonData.Info,
	})

	//Convert the data to yaml format
	yamlData, err := yaml.Marshal(&jsonData)

	if err != nil {
		fmt.Printf("Error while Marshaling. %v", err)
	}

	//Create a temporary YAML file
	tmpfile, err := os.CreateTemp(os.TempDir(), "test.yaml")
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Unable to create Temporary file")
		return
	}
	defer os.Remove(tmpfile.Name()) //Cleanup the temporary file after serving

	//Write YAML data to the temporary file
	if _, err := tmpfile.Write(yamlData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to write"})
		return
	}
	//Close the file after finishing
	if err := tmpfile.Close(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to close temporary file"})
		return
	}
	//Set the appropriate headers to trigger a download in the browser
	c.Writer.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", tmpfile.Name()))
	c.Writer.Header().Set("Content-Type", "application/x-yaml")
	http.ServeFile(c.Writer, c.Request, tmpfile.Name())

	//Create a yaml file for checking
	//filename := "test.yaml"
	//err = os.WriteFile(filename, yamlData, 0664)
	//if err != nil {
	//	panic("Unable to write data into the file")
	//}

	//mongodb.InsertData(yamlData)
}

// Save data To MongoDB by using InsertData method in mongodb.go
// lastest edit
func SaveToDB(c *gin.Context) {
	var template Template

	// Read the JSON body
	if err := c.ShouldBindJSON(&template); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid JSON data",
			"details": err.Error(),
		})
		return
	}

	template.Local = 1

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check for an existing document with the same ID
	filter := bson.M{"id": template.ID}

	var existingTemplate Template
	err := collection.FindOne(ctx, filter).Decode(&existingTemplate)

	// There are 3 scenarios to handle
	// First scenario, check if Template ID does not exist, then create one
	if err == mongo.ErrNoDocuments {
		result, err := collection.InsertOne(ctx, template)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to save the template",
				"details": err.Error(),
			})
			return
		}
		// Return a message to user/frontend
		c.JSON(http.StatusOK, gin.H{
			"action": "created",
			"id":     result.InsertedID,
		})
	} else if err != nil {
		// If an error other than ErrNoDocuments occurred, return it
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve existing template",
			"details": err.Error(),
		})
		return
	} else {
		// Second scenario, if the data is unchanged (duplicate), return a 409 conflict error
		// Note: .Equal() must be a method you implement for comparing two Template objects
		if template.Equal(existingTemplate) {
			c.JSON(http.StatusConflict, gin.H{
				"error": "Duplicate data - no changes detected",
			})
			return
		} else {
			// Third scenario, if data is updated, perform the update operation
			update := bson.M{"$set": template}
			_, err := collection.UpdateOne(ctx, filter, update)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to update the template",
					"details": err.Error(),
				})
				return
			}
			// Return a message indicating the update was successful
			c.JSON(http.StatusOK, gin.H{
				"action": "updated",
				"id":     template.ID,
			})
		}
	}
}

//upload page
func UploadToDB(c *gin.Context) {
	// Read the file from the request
	_, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error reading the uploaded file"})
		return
	}

	// Save the file to a temporary directory
	tmpDir := "temp-uploads"
	filePath := filepath.Join(tmpDir, header.Filename)
	err = c.SaveUploadedFile(header, filePath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error saving the uploaded file"})
		log.Printf("Error saving the uploaded file: %v", err)
		return
	}

	// Read the file content
	content, err := os.ReadFile(filePath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error reading the uploaded file"})
		return
	}

	// Parse the content and convert it to JSON if it's a YAML file
	var data Template
	fileExt := strings.ToLower(filepath.Ext(header.Filename))
	if fileExt == ".yaml" {
		err = yaml.Unmarshal(content, &data)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error parsing the YAML file"})
			log.Printf("Error parsing the YAML file: %v", err)

			return
		}
	} else if fileExt == ".json" {
		err = json.Unmarshal(content, &data)
		if err != nil {
			c.JSON(405, gin.H{
				"error": err.Error(),
			})
			return
		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported file type"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if data.ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing ID in the uploaded file"})
		return
	}
	filter := bson.M{"id": data.ID}

	data.Local = 1

	var existingTemplate Template
	if collection == nil {
		log.Println("Collection is nil")
		return
	}
	err = collection.FindOne(ctx, filter).Decode(&existingTemplate)
	if err != nil {
		log.Printf("Error retrieving template: %v", err)

	}
	if err == mongo.ErrNoDocuments {
		result, err := collection.InsertOne(ctx, data)
		if err != nil {
			log.Printf("Error inserting template: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to save the template",
			})
			return
		}
		//reture message to user/frontend
		c.JSON(http.StatusOK, gin.H{
			//Template saved successfully
			"action": "created",
			"id":     result.InsertedID,
		})
	} else if err != nil {
		log.Printf("Error retrieving template: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve existing template",
		})
		return
	} else {
		// Second scenario, If all the Data == unchanged(Duplicated), return 409 error
		if data.Equal(existingTemplate) {
			c.JSON(http.StatusConflict, gin.H{
				"error": "Duplicated data",
				"data":  data,
			})
			return
		} else {
			// Third scenario, if Data == Updated, return 200 OK
			update := bson.M{"$set": data}
			_, err := collection.UpdateOne(ctx, filter, update)

			if err != nil {
				log.Printf("Error updating template: %v\n", err)
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Failed to update the template",
				})
				return
			}
			c.JSON(http.StatusOK, gin.H{
				//Template updated successfully
				"action": "updated",
				"id":     data.ID,
			})
		}

	}
	err = os.RemoveAll(tmpDir)
	if err != nil {
		log.Printf("Error deleting the temp-uploads directory: %v", err)
		// Handle the error as needed, e.g., return an error response
	}

}

//return ture if the data is the same
func (t Template) Equal(other Template) bool {
	return t.ID == other.ID &&
		t.Info.Name == other.Info.Name &&
		t.Info.Author == other.Info.Author &&
		t.Info.Severity == other.Info.Severity &&
		t.Info.Description == other.Info.Description &&
		t.Info.Remediation == other.Info.Remediation &&
		reflect.DeepEqual(t.Info.Reference, other.Info.Reference) &&
		t.Info.Classification.CvssMetrics == other.Info.Classification.CvssMetrics &&
		t.Info.Classification.CvssScore == other.Info.Classification.CvssScore &&
		t.Info.Classification.CveID == other.Info.Classification.CveID &&
		t.Info.Classification.CweID == other.Info.Classification.CweID &&
		t.Info.Metadata.Verified == other.Info.Metadata.Verified &&
		t.Info.Metadata.ShodanQuery == other.Info.Metadata.ShodanQuery &&
		t.Info.Tags == other.Info.Tags
}
