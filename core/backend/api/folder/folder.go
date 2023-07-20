package folder

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

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

func CreateFolder(folderName string) {
	// a button

	//
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
