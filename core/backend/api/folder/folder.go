package folder

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Folder struct {
	ID     string      `bson:"_id" json:"_id"`
	Folder InnerFolder `bson:"folder" json:"folder"`
}

type InnerFolder struct {
	Project  []Project `bson:"project" json:"project"`
	Status   string    `bson:"status" json:"status"`
	Lastscan int64     `bson:"lastscan" json:"lastscan"`
	Ownerid  int       `bson:"ownerid" json:"ownerid"`
}

type Project struct {
	ID   string   `bson:"_id,omitempty" json:"_id,omitempty"`
	PID  string   `bson:"pid,omitempty" json:"pid,omitempty"`
	Host []string `bson:"host,omitempty" json:"host,omitempty"`
}

func ListRecords(c *gin.Context, collection *mongo.Collection) {
	// Retrieve all documents from the collection
	cursor, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing records"})
		return
	}
	defer cursor.Close(context.Background())

	// Iterate through the returned cursor.
	var results []bson.M
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing records"})
		return
	}

	c.JSON(http.StatusOK, results)
}

func CreateFolder(c *gin.Context, collection *mongo.Collection) {
	var folder Folder

	// Decode the JSON request body into the Folder struct
	if err := c.ShouldBindJSON(&folder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Insert the folder into the collection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, folder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create folder"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Folder created successfully"})
}

func RemoveFolder() {
	// a button
}

func ViewFolderItem() {
	//a function that show the Folder content
}

func GetFolderList() {
	//user own Folder List
}
