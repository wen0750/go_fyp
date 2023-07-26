package project

import (
	"go_fyp/core/backend/services/database"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
)

type InputCreateProject struct {
	Name     string        `json:"name"`
	Fid      int           `json:"fid"`
	Host     []string      `json:"host"`
	Poe      []interface{} `json:"poe"`
	Template string        `json:"template"`
}

type Folder struct {
	Name     string   `json:"name"`
	Project  []string `json:"project"`
	Status   string   `json:"status"`
	Lastscan int      `json:"lastscan"`
	Ownerid  int      `json:"ownerid"`
}

type Project struct {
	Name string        `json:"name"`
	Pid  string        `json:"pid"`
	Host []string      `json:"host"`
	Poe  []interface{} `json:"poe"`
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

func AddProjectToFolder() {

}

func UpDateProjectProfile() {

}

func RemoveProjectFromFolder() {

}

func GetPOEList() {

}
