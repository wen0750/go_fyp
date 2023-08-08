package project

import (
	"context"
	"go_fyp/core/backend/services/database"
	"net/http"
	"time"

	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

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
	Name     string   `json:"name"`
	Pid      string   `json:"pid"`
	Host     []string `json:"host"`
	Poc      []string `json:"poc"`
	LastScan int      `json:"lastscan"`
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

	var newProject = ProjectItem{inputData.Name, inputData.Fid, inputData.Host, poc, 1000}

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

	err := collection.FindOneAndUpdate(ctx, filter, update).Decode(&result)
	return result, err
}

func UpDateProjectProfile() {

}

func RemoveProjectFromFolder() {

}

func GetPOEList() {

}
