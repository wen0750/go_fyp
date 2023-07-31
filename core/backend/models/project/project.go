package project

import (
	"go_fyp/core/backend/services/database"

	"log"

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

type Project struct {
	Name     string   `json:"name"`
	Pid      string   `json:"pid"`
	Host     []string `json:"host"`
	Poc      []string `json:"poc"`
	LastScan int16    `json:"lastscan"`
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

func ProjectCreateHandeler() {
	var inputData InputCreateProject
	var poc []string
	switch inputData.Template {
	case "customs":
		poc = inputData.Poc
	case "wordpress":
		poc = []string{"wp"}
	}

	var newProject = Project(inputData.Name, inputData.Fid, inputData.Host, poc, 1)

	// // addProjectToFolder(newProject, inputData.Fid)
}

// func addProjectToFolder(projectDetail Project, fid string) (bson.M, error) {
// 	var result bson.M

// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()

// 	objID, _ := primitive.ObjectIDFromHex(fid)
// 	filter := bson.M{"_id": objID}
// 	update := bson.M{
// 		"$push": bson.M{"project": projectDetail},
// 	}

// 	// result, err := collection.findOneAndUpdate(ctx, filter, update)
// 	// return result, err
// }

func UpDateProjectProfile() {

}

func RemoveProjectFromFolder() {

}

func GetPOEList() {

}
