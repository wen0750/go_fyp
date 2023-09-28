package cve

import (
	"context"
	"fmt"
	"go_fyp/core/backend/services/database"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CveBase struct {
	ID          string `bson:"_id"`
	CveMetadata struct {
		CveID             string `bson:"cveId"`
		State             string `bson:"state"`
		AssignerShortName string `bson:"assignerShortName"`
		DateReserved      string `bson:"dateReserved"`
		DatePublished     string `bson:"datePublished"`
		DateUpdated       string `bson:"dateUpdated"`
	} `bson:"cveMetadata"`
	Containers struct {
		Cna struct {
			Descriptions []struct {
				Lang  string `bson:"lang"`
				Value string `bson:"value"`
			} `bson:"descriptions"`
		} `bson:"cna"`
	} `bson:"containers"`
}

var dbClient *mongo.Collection

func init() {
	var err error
	dbClient, err = database.InitializeMongoDB("cve")
	if err != nil {
		log.Fatalf("Error initializing MongoDB 'CVE' collection: %v\n", err)
	} else {
		log.Println("MongoDB (Templates) initialized successfully")
	}
}

func ListAll() ([]CveBase, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var result []CveBase

	// basic setting
	filter := bson.D{{Key: "cveMetadata.cveId", Value: primitive.Regex{Pattern: "CVE-"}}}
	opts := options.Find().SetSort(bson.D{{Key: "cveMetadata.cveId", Value: -1}}).SetLimit(25)
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

func ListOne(cveid string) (CveBase, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var result CveBase

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

func Search(inData bson.D) ([]CveBase, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var result []CveBase

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
