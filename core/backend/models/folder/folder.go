package folder

import (
	"context"
	"go_fyp_test/core/backend/services/database"
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

var collection *mongo.Collection

func init() {
	connection, err := database.InitializeMongoDB("Folder")
	if err != nil {
		log.Fatalf("Error initializing MongoDB Folders collection: %v\n", err)
	} else {
		collection = connection
		log.Println("MongoDB (folder) initialized successfully")
	}
}

func GetFolder(c *gin.Context) {
	// Retrieve all documents from the collection
	cursor, err := collection.Find(context.Background(), bson.D{})
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
	cursor, err := collection.Find(context.Background(), bson.D{})
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

	_, err := collection.InsertOne(ctx, folderObject)
	if err != nil {

		// gin.H{"error": err.Error()}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Folder created successfully"})
	return
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

	_, err = collection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove folder"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Folder removed successfully"})
}

func ViewFolderItem() {
	//a function that show the Folder content
}
