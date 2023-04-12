//For testing:
//1. Use Postman and type [kali IP]:8888/editor

package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	//Use POST method to receive json data from Website
	// "/editor" is a temporary URL
	router.POST("/editor", func(c *gin.Context) {
		id := c.Query("id")						//get id from header
		page := c.DefaultQuery("page", "0")		//get page from header
		name := c.PostForm("name")				//get key from body
		message := c.PostForm("message")		//get key from body
		fmt.Printf("id: %T; page: %T; name: %T; message: %T", id, page, name, message)

		//It will show the json formated data below when it success
		c.JSON(200, gin.H{ 
			"message": message,
			"status":  200,
		})
	})

	router.Run(":8888")
}
