//For testing:
//1. Use Postman and type [kali IP]:8888/editor

package main

import (
	"fmt"
	"os"

	"gilab.com/pragmaticreviews/golang-gin-poc/mongodb"
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
	filename := "test.yaml"
	err = os.WriteFile(filename, yamlData, 0777)
	if err != nil {
		panic("Unable to write data into the file")
	}
}

func main() {
	router := gin.Default()
	mongodb.NewDB()
	//Use POST method to receive json data from Website
	// "/editor" is a temporary URL
	router.POST("/editor", GetYMAL)

	router.Run(":8888")
}
