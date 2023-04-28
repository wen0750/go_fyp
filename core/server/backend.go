//For testing:
//1. Use Postman and type [kali IP]:8888/editor

package main

import (
	"fmt"
	"net/http"
	"os"

	"gilab.com/pragmaticreviews/golang-gin-poc/mongodb"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gopkg.in/yaml.v3"
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

// receive raw json data and convert it into .yaml file
func GetYMAL(c *gin.Context) {
	//receive data from website with POST method
	jsonData := Template{}
	c.BindJSON(&jsonData)
	//For checking, check the response on Postman
	c.JSON(200, gin.H{
		"id":        jsonData.ID,
		"info":      jsonData.Info,
		"requests":  jsonData.Requests,
		"workflows": jsonData.Workflows,
	})

	//Convert the data to yaml format
	yamlData, err := yaml.Marshal(&jsonData)

	if err != nil {
		fmt.Printf("Error while Marshaling. %v", err)
	}

	//write output into the file
	//filename := "test.yaml"

	//Create a temporary YAML file
	tmpfile, err := os.CreateTemp(os.TempDir(), "test.yaml")
	if err != nil {
		c.JSON(http.StatusInternalServerError,"Unable to create Temporary file")
		return
	}
	defer os.Remove(tmpfile.Name()) //Cleanup the temporary file after serving 

	//Write YAML data to the temporary file
	if _, err := tmpfile.Write(yamlData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to write"})
		return
	} 
	//Close the file after finishing
	if err := tmpfile.Close(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"Unable to close temporary file"})
		return
	}
	//Set the appropriate headers to trigger a download in the browser
	c.Writer.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", tmpfile.Name()))
	c.Writer.Header().Set("Content-Type", "application/x-yaml") 
	
	//Create a yaml file for checking
	filename := "test.yaml"
	err = os.WriteFile(filename, yamlData, 0664)
	if err != nil {
		panic("Unable to write data into the file")
	}

	//mongodb.InsertData(yamlData)
}

func main() {
	router := gin.Default()

	router.Use(cors.Default())

	mongodb.ConnectDB()
	//Use POST method to receive json data from Website
	// "/editor" is a temporary URL
	router.POST("/editor", GetYMAL)

	router.Run(":8888")
}
