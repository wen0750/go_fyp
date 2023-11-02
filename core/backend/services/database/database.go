package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoURI string = "mongodb+srv://sam1916:ue6aE6jfXGtBvwS@cluster1.mrkha9f.mongodb.net/?retryWrites=true&w=majority"
var dbName string = "FYP"
var collection *mongo.Collection

// create a template structure
type Template struct {
	ID   string `json:"id"`
	Info struct {
		Name        string   `json:"name,omitempty"`
		Author      string   `json:"author,omitempty"`
		Severity    string   `json:"severity,omitempty"`
		Description string   `json:"description,omitempty"`
		Remediation string   `json:"remediation,omitempty"`
		Reference   []string `json:"reference,omitempty"`
		
		Classification struct {
			CvssMetrics string  `json:"cvss-metrics,omitempty"`
			CvssScore   float64 `json:"cvss-score,omitempty"`
			CveID       string  `json:"cve-id,omitempty"`
			CweID       string  `json:"cwe-id,omitempty"`
		} `json:"classification,omitempty"`
		
		Metadata struct {
			Verified    bool   `json:"verified,omitempty"`
			ShodanQuery string `json:"shodan-query,omitempty"`
			MaxRequest int `json:"max-request,omitempty"`
		} `json:"metadata,omitempty"`
		
		Tags string `json:"tags,omitempty"`
	} `json:"info,omitempty"`

	Variables map[string]interface{} `json:"variables,omitempty"`

	HTTP []struct {
		Method            string `json:"method,omitempty"`
		Path              []string `json:"path,omitempty"`
		Raw               []string `json:"raw,omitempty"`
		Payloads          map[string]string `json:"payloads,omitempty"`
		Threads           int               `json:"threads,omitempty"`
		StopAtFirstMatch  bool `json:"stop-at-first-match,omitempty"`
		MatchersCondition string `json:"matchers-condition,omitempty"`
		//
		Matchers []struct {
			Type      string   `json:"type,omitempty"`
			Part      string   `json:"part,omitempty"`
			Words     []string `json:"words,omitempty"`
			Dsl       []string `json:"dsl,omitempty"`
			Regex     []string `json:"regex,omitempty"`
			Condition string   `json:"condition,omitempty"`
			Status    []int    `json:"status,omitempty"`
		} `json:"matchers,omitempty"`
		
		Extractors []struct {
			Type  string   `json:"type,omitempty"`
			Name  string   `json:"name,omitempty"`
			Json  []string `json:"json,omitempty"`
			Part  string   `json:"part,omitempty"`
		} `json:"extractors,omitempty"`
	} `json:"http,omitempty"`
	
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
		log.Println("Collection found")
	}

	// err = EnsureUniqueIndex(client, collectionName)
	// if err != nil {
	// 	log.Fatalf("Error ensuring unique index: %v\n", err)
	// 	return nil, err
	// } else {
	// 	log.Printf("Unique Key set successful")
	// }

	collection := client.Database(dbName).Collection(collectionName)
	return collection, nil
}
