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
	ID   string                 `json:"id"`
	Info map[string]interface{} `json:"info,omitempty"`
	HTTP []interface{}          `json:"http,omitempty"`
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

    if err := c.ShouldBindJSON(&template); err != nil {
        log.Printf("Error binding JSON: %v\n", err)
        c.JSON(http.StatusBadRequest, gin.H{
            "error":   "Invalid JSON data",
            "details": err.Error(),
        })
        return
    }

	template.Local = 1

	// Read the JSON body
    bsonDoc, err := structToBsonM(&template)
    if err != nil {
        log.Printf("Error converting struct to bson.M: %v\n", err)
        c.JSON(http.StatusInternalServerError, gin.H{
            "error":   "Failed to save the template",
            "details": err.Error(),
        })
        return
    }


	err = removeEmptyFieldsAndSave(c, &template)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error":   "Failed to save the template",
            "details": err.Error(),
        })
        return
    }

	log.Printf("Cleaned template: %+v\n", template) // Log the cleaned template

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check for an existing document with the same ID
	filter := bson.M{"id": template.ID}
	var existingTemplate Template

	err = collection.FindOne(ctx, filter).Decode(&existingTemplate)
	if err != nil && err != mongo.ErrNoDocuments {
		log.Printf("Error finding existing template: %v\n", err) // Log the error
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve existing template",
			"details": err.Error(),
		})
		return
	}

	if err == mongo.ErrNoDocuments {
		// Document does not exist, insert a new one
		result, err := collection.InsertOne(ctx, bsonDoc)
		if err != nil {
			log.Printf("Error inserting new template: %v\n", err) // Log the error
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to save the template",
				"details": err.Error(),
			})
			return
		}
		log.Printf("Template created with ID: %v\n", result.InsertedID) // Log success
		c.JSON(http.StatusOK, gin.H{
			"action": "created",
			"id":     result.InsertedID,
		})
		return
	}

	update := bson.M{"$set": template}
	_, err = collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error updating template: %v\n", err) // Log the error
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to update the template",
			"details": err.Error(),
		})
		return
	}

	log.Printf("Template updated with ID: %v\n", template.ID) // Log the update success
	c.JSON(http.StatusOK, gin.H{
		"action": "updated",
		"id":     template.ID,
	})
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
	return reflect.DeepEqual(t, other)
}

func removeEmptyFieldsAndSave(c *gin.Context, template *Template) error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    // Marshal the struct to JSON
    jsonData, err := json.Marshal(template)
    if err != nil {
        return err
    }

    // Unmarshal JSON to a map, which will omit the empty fields
    var bsonData map[string]interface{}
    err = json.Unmarshal(jsonData, &bsonData)
    if err != nil {
        return err
    }

    // Clean the bsonData map to remove nil or zero fields
    cleanBsonMap(bsonData)

    // Insert the cleaned data into MongoDB
    _, err = collection.InsertOne(ctx, bsonData)
    if err != nil {
        return err
    }

    return nil
}

// cleanBsonMap recursively removes nil or zero fields from the bson map
func cleanBsonMap(data map[string]interface{}) {
    for k, v := range data {
        if isZero(v) {
            delete(data, k)
        } else if subMap, ok := v.(map[string]interface{}); ok {
            cleanBsonMap(subMap)
        } else if subSlice, ok := v.([]interface{}); ok {
            for i, sv := range subSlice {
                if subMap, ok := sv.(map[string]interface{}); ok {
                    cleanBsonMap(subMap)
                } else if isZero(sv) {
                    subSlice[i] = nil // Set nil to be able to remove it later
                }
            }
            // Remove nil values from the slice
            data[k] = removeNilValuesFromSlice(subSlice)
        }
    }
}

// isZero checks if the value is nil or the zero value for a type
func isZero(v interface{}) bool {
    return v == nil || reflect.DeepEqual(v, reflect.Zero(reflect.TypeOf(v)).Interface())
}

// removeNilValuesFromSlice creates a new slice with non-nil values
func removeNilValuesFromSlice(slice []interface{}) []interface{} {
    var newSlice []interface{}
    for _, v := range slice {
        if v != nil {
            newSlice = append(newSlice, v)
        }
    }
    return newSlice
}

func structToBsonM(v interface{}) (bson.M, error) {
    val := reflect.ValueOf(v).Elem()
    doc := bson.M{}

    for i := 0; i < val.NumField(); i++ {
        field := val.Field(i)
        fieldType := val.Type().Field(i)
        fieldName := fieldType.Name
        jsonTag := fieldType.Tag.Get("json")

        // If the json tag is "-", this field should be skipped.
        if jsonTag == "-" {
            continue
        }

        // If there's a json tag other than "-", use that tag name instead of the struct field name.
        jsonTagParts := strings.Split(jsonTag, ",")
        if jsonTagParts[0] != "" && jsonTagParts[0] != "-" {
            fieldName = jsonTagParts[0]
        }

        // If the field is empty and the "omitempty" option is set, skip it.
        if len(jsonTagParts) > 1 && jsonTagParts[1] == "omitempty" && isEmptyValue(field) {
            continue
        }

        // Recursively handle nested structs.
        if field.Kind() == reflect.Struct {
            // If the nested struct is not nil, process it recursively.
            nestedDoc, err := structToBsonM(field.Addr().Interface())
            if err != nil {
                return nil, err
            }
            // Only add the nested document if it's not empty.
            if len(nestedDoc) > 0 {
                doc[fieldName] = nestedDoc
            }
        } else {
            doc[fieldName] = field.Interface()
        }
    }
    return doc, nil
}

func isEmptyValue(v reflect.Value) bool {
    switch v.Kind() {
    case reflect.Array, reflect.Map, reflect.Slice, reflect.String:
        return v.Len() == 0
    case reflect.Bool:
        return !v.Bool()
    case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
        return v.Int() == 0
    case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
        return v.Uint() == 0
    case reflect.Float32, reflect.Float64:
        return v.Float() == 0
    case reflect.Interface, reflect.Ptr:
        return v.IsNil()
    }
    return false
}
