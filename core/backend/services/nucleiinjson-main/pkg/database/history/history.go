package history

import (
	"context"
	"time"

	"log"

	"github.com/wen0750/nucleiinjson/pkg/database"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var collection *mongo.Collection

func init() {
	db, err := database.InitializeMongoDB("History")
	if err != nil {
		log.Fatalf("Error initializing MongoDB Folders collection: %v\n", err)
	} else {
		collection = db
		log.Println("MongoDB (folder) initialized successfully")
	}
}

// func InsertRecord(data interface{}, fid string) {
// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()

// 	if collection != nil {
// 		collection.InsertOne(ctx, data)
// 	}
// }

func InsertRecord(data interface{}, fid string) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, _ := primitive.ObjectIDFromHex(fid)
	filter := bson.M{"_id": objID}
	update := bson.M{
		"$push": bson.M{"result": data},
	}

	collection.FindOneAndUpdate(ctx, filter, update)
}
