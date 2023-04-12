package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.POST("/editor", func(c *gin.Context) {
		id := c.Query("id")
		page := c.DefaultQuery("page", "0")
		name := c.PostForm("name")
		message := c.PostForm("message")
		fmt.Printf("id: %s; page: %s; name: %s; message: %s", id, page, name, message)

		c.JSON(200, gin.H{
			"message": message,
			"status":  200,
		})
	})

	router.Run(":8888")
}
