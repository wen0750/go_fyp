//For testing:
//1. Use Postman and type [kali IP]:8888/editor

package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"gilab.com/pragmaticreviews/golang-gin-poc/mongodb"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/yaml.v3"
)

var collection *mongo.Collection

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



// receive raw json data and convert it into .yaml file
func Download(c *gin.Context) {
	//receive data from website with POST method
	jsonData := Template{}
	c.BindJSON(&jsonData)
	//For checking, check the response on Postman
	c.JSON(200, gin.H{
		"id":        jsonData.ID,
		"info":      jsonData.Info,
		"requests":  jsonData.Requests,
		"workflows": jsonData.Workflows,
	})

	//Convert the data to yaml format
	yamlData, err := yaml.Marshal(&jsonData)

	if err != nil {
		fmt.Printf("Error while Marshaling. %v", err)
	}

	//Create a temporary YAML file
	tmpfile, err := os.CreateTemp(os.TempDir(), "test.yaml")
	if err != nil {
		c.JSON(http.StatusInternalServerError,"Unable to create Temporary file")
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
		c.JSON(http.StatusInternalServerError, gin.H{"error":"Unable to close temporary file"})
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
func SaveToDB(c *gin.Context) {
	var template Template
	
	// Bind the JSON data received to the Template struct
	if err := c.ShouldBindJSON(&template); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid JSON data",
		})
		return
	}

	// Validate the input data
	if template.Info.Name == "" || template.Info.Author == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Name and Author fields must not be empty",
		})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Insert the Template into the MongoDB collection
	result, err := collection.InsertOne(ctx, template)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			c.JSON(http.StatusConflict, gin.H{"error": "Duplicate entry"})
		} else {
			log.Printf("Error inserting template: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to save the template",
			})
		}
		return
    }

	c.JSON(http.StatusOK, gin.H{
		"message": "Template saved successfully",
		"id":      result.InsertedID,
	})
}

func main() {
	var err error
	router := gin.Default()
	router.Use(cors.Default())
	
	//check if collectionName is exist, if not, create one
	mongoURI := "mongodb+srv://sam1916:ue6aE6jfXGtBvwS@cluster0.981q5hl.mongodb.net/?retryWrites=true&w=majority"
    dbName := "FYP"
    collectionName := "Templates"

    collection, err = mongodb.CheckCollectionExists(mongoURI, dbName, collectionName)
    if err != nil {
        mongodb.CreateCollection(mongoURI,dbName,collectionName)
    } else{
		log.Println("Collection already exist")
	}

	err = mongodb.EnsureUniqueIndex(mongoURI, dbName, collectionName)
	if err != nil {
		log.Fatalf("Error ensuring unique index: %v\n", err)
	}

	//Use POST method to receive json data from Website
	router.POST("/editor/:action", func(c *gin.Context) {
		action := c.Param("action")
		if action == "save" {
			SaveToDB(c)
		} else if (action == "download"){
			Download(c)
		}
	})
	//This router.POST is for testing
	router.POST("/editor", SaveToDB)
	router.Run(":8888")
}