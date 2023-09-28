package cwe

import (
	"context"
	"fmt"
	"go_fyp/core/backend/services/database"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CweBase struct {
	ID          string `bson:"_id"`
	CweID       string `bson:"_ID"`
	Name        string `bson:"_Name"`
	Description string `bson:"Description"`
}

var dbClient *mongo.Collection

func init() {
	var err error
	dbClient, err = database.InitializeMongoDB("cwe")
	if err != nil {
		log.Fatalf("Error initializing MongoDB 'CVE' collection: %v\n", err)
	} else {
		log.Println("MongoDB (Templates) initialized successfully")
	}
}

func ListAll() ([]CweBase, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var result []CweBase

	// basic setting
	filter := bson.D{{Key: "Applicable_Platforms.Technology._Class", Value: "Web Based"}}
	opts := options.Find().SetSort(bson.D{{Key: "_ID", Value: 1}}).SetLimit(25)
	cursor, err := dbClient.Find(ctx, filter, opts)
	defer cancel()

	// format result and error handling
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, nil
}

func ListOne(cveid string) (CweBase, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var result CweBase

	// basic setting
	filter := bson.D{{Key: "cveMetadata.cveId", Value: cveid}}
	err := dbClient.FindOne(ctx, filter).Decode(&result)
	defer cancel()

	// format result and error handling
	if err != nil {
		return result, err
	}
	return result, nil
}

func Search(inData bson.D) ([]CweBase, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var result []CweBase

	// basic setting
	fmt.Printf("%+v\n", inData)
	filter := inData
	opts := options.Find().SetLimit(50)
	cursor, err := dbClient.Find(ctx, filter, opts)
	defer cancel()

	// format result and error handling
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &result); err != nil {
		fmt.Println(err)
		return nil, err
	}
	return result, nil
}
