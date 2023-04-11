package main

import "github.com/gin-gonic/gin"

func main() {
	server := gin.Default()

	server.POST("/test", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "ok",
		})
	})
	server.Run(":8888")
}
