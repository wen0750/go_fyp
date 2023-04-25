//For testing:
//1. Use Postman and type [kali IP]:8888/editor

package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Template struct {
	Name    string `json:"name"`
	Request struct {
		Path              string `json:"path"`
		Method            string `json:"method"`
		MatchersCondition string `json:"matchersCondition"`
		Matchers          []struct {
			Type  string   `json:"path"`
			Part  string   `json:"part"`
			Words []string `json:"words"`
		} `json:"matchers"`
	} `json:"request"`
}

func GetData(c *gin.Context) {
	jsonData := Template{}
	c.BindJSON(&jsonData)
	c.JSON(http.StatusOK, gin.H{
		"name":    jsonData.Name,
		"request": jsonData.Request,
	})
}

func main() {
	router := gin.Default()
	//Use POST method to receive json data from Website
	// "/editor" is a temporary URL
	router.POST("/editor", GetData)

	router.Run(":8888")
}
