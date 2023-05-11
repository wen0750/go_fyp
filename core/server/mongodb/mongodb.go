package mongodb

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// create a template structure
type Template struct {
	ID   string `json:"id,omitempty"`
	Info struct {
		Name        string   `json:"name,omitempty"`
		Author      string   `json:"author,omitempty"`
		Severity    string   `json:"severity,omitempty"`
		Description string   `json:"description,omitempty"`
		Remediation string   `json:"remediation,omitempty"`
		Reference   []string `json:"reference,omitempty"`
		//
		Classification struct {
			CvssMetrics string  `json:"cvss-metrics,omitempty"`
			CvssScore   float64 `json:"cvss-score,omitempty"`
			CveID       string  `json:"cve-id,omitempty"`
			CweID       string  `json:"cwe-id,omitempty"`
		} `json:"classification,omitempty"`
		//
		Metadata struct {
			Verified    bool   `json:"verified,omitempty"`
			ShodanQuery string `json:"shodan-query,omitempty"`
		} `json:"metadata,omitempty"`
		//
		Tags string `json:"tags,omitempty"`
	} `json:"info,omitempty"`
	//
	Requests []struct {
		Raw               []string `json:"raw,omitempty"`
		CookieReuse       bool     `json:"cookie-reuse,omitempty"`
		Method            string   `json:"method,omitempty"`
		Path              []string `json:"path,omitempty"`
		Redirects         bool     `json:"redirects,omitempty"`
		MaxRedirects      int      `json:"max-redirects,omitempty"`
		StopAtFirstMatch  bool     `json:"stop-at-first-match,omitempty"`
		MatchersCondition string   `json:"matchers-condition,omitempty"`
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
		//
		Extractors []struct {
			Type  string   `json:"type,omitempty"`
			Name  string   `json:"name,omitempty"`
			Group int      `json:"group,omitempty"`
			Regex []string `json:"regex,omitempty"`
		} `json:"extractors,omitempty"`
	} `json:"requests,omitempty"`
	//
	Workflows []struct {
		Template string `json:"template,omitempty"`
		//
		Subtemplates []struct {
			Tags string `json:"tags,omitempty"`
		} `json:"subtemplates,omitempty"`
	} `json:"workflows,omitempty"`
}

var collection *mongo.Collection


func ConnectDB() *mongo.Client{
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI("mongodb+srv://sam1916:ue6aE6jfXGtBvwS@cluster0.981q5hl.mongodb.net/?retryWrites=true&w=majority").SetServerAPIOptions(serverAPI)
	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}
	return client
	// Send a ping to confirm a successful connection
	//if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Err(); err != nil {
	//	panic(err)
	//}
	//fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")
	
	/* Check how many tables in mongodb
	db := client.Database("admin")
	collection = db.Collection("yourCollectionName")
	
	collectionNames, err := client.Database("admin").ListCollectionNames(context.TODO(), bson.D{})
	if err != nil {
    panic(err)
	}
	fmt.Printf("Your collection names are %s",collectionNames)
	return client
	*/
}

func CreateCollection(mongoURI, dbName, collectionName string) (*mongo.Collection, error) {

	// Create a new client and connect to MongoDB server
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoURI))
	if err != nil {
        log.Printf("Error connecting to MongoDB: %v\n", err)
        return nil, err
    }

	//create table in mongoDB
	collection := client.Database(dbName).Collection(collectionName)
	return collection, nil
}

func EnsureCollectionExists(mongoURI, dbName, collectionName string) (*mongo.Collection, error) {
    client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoURI))
    if err != nil {
        log.Printf("Error connecting to MongoDB: %v\n", err)
        return nil, err
    }

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



func InsertTemplate(ctx context.Context, client *mongo.Client, template *Template) error {
	collection := client.Database("FYP").Collection("Templates")
	_, err := collection.InsertOne(ctx, template)
	return err
}
