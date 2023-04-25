//For testing:
//1. Use Postman and type [kali IP]:8888/editor

package main

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"gopkg.in/yaml.v3"
)

type Template struct {
	Name    string `json:"name"`
	Request struct {
		Path              string `json:"path"`
		Method            string `json:"method"`
		MatchersCondition string `json:"matchersCondition"`
		Matchers          []struct {
			Type  string   `json:"type"`
			Part  string   `json:"part"`
			Words []string `json:"words"`
		} `json:"matchers"`
	} `json:"request"`
}

func GetYMAL(c *gin.Context) {
	jsonData := Template{}
	c.BindJSON(&jsonData)
	c.JSON(http.StatusOK, gin.H{
		"name":    jsonData.Name,
		"request": jsonData.Request,
	})

	yamlData, err := yaml.Marshal(&jsonData)

	if err != nil {
		fmt.Printf("Error while Marshaling. %v", err)
	}

	filename := "test.yaml"
	err = ioutil.WriteFile(filename, yamlData, 0777)
	if err != nil {
		panic("Unable to write data into the file")
	}
}

func main() {
	router := gin.Default()
	//Use POST method to receive json data from Website
	// "/editor" is a temporary URL
	router.POST("/editor", GetYMAL)

	router.Run(":8888")
}
