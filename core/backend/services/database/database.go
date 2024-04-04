package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoURI string = "mongodb://fyp_admin:nPg6Q6eOS4kUxgtMH2mrbmD4Gkh0Z1oa@unifi.wen0750.club:27017/FYP"
var dbName string = "FYP"
var collection *mongo.Collection

// create a template structure
type Template struct {
	ID   string                 `json:"id"`
	Info map[string]interface{} `json:"info,omitempty"`
	HTTP []interface{}          `json:"http,omitempty"`
	Local int `json:"local,omitempty"`
}

// create a template structure
func CreateCollection(client *mongo.Client, collectionName string) (*mongo.Collection, error) {
	//create table in mongoDB
	collection := client.Database(dbName).Collection(collectionName)
	return collection, nil
}

func CheckCollectionExists(client *mongo.Client, collectionName string) (*mongo.Collection, error) {
	//List out all the Collection Names
	db := client.Database(dbName)
	collections, err := db.ListCollectionNames(context.Background(), bson.M{})
	if err != nil {
		log.Printf("Error listing collections: %v\n", err)
		return nil, err
	}

	for _, collName := range collections {
		if collName == collectionName {
			return db.Collection(collectionName), nil
		}
	}

	return db.Collection(collectionName), nil
}

//Prevent users to inserting the same data into MongoDB
func EnsureUniqueIndex(client *mongo.Client, collectionName string) error {
	collection := client.Database(dbName).Collection(collectionName)

	indexModel := mongo.IndexModel{
		Keys: bson.D{
			{Key: "id", Value: 1},
		},
		Options: options.Index().SetUnique(true),
	}

	_, err := collection.Indexes().CreateOne(context.Background(), indexModel)
	if err != nil {
		log.Printf("Error creating unique index: %v\n", err)
		return err
	}

	return nil
}

// Connect, Check collection, Create collection if not exist
func InitializeMongoDB(collectionName string) (*mongo.Collection, error) {
	// Connect to DB with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Printf("Error connecting to MongoDB: %v\n", err)
		return nil, err
	}

	_, err = CheckCollectionExists(client, collectionName)
	if err != nil {
		_, err = CreateCollection(client, collectionName)
		if err != nil {
			log.Printf("Error creating collection: %v\n", err)
			return nil, err
		}
		log.Println("Collection created")
	} else {
	}
	collection := client.Database(dbName).Collection(collectionName)
	return collection, nil
}
