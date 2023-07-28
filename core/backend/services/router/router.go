package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"go_fyp_test/core/backend/models/editor"
	"go_fyp_test/core/backend/models/folder"
)

func Initialize() {
	router := gin.Default()
	router.Use(cors.Default())
	routing(router)
	router.Run(":8888")
}

func routing(router *gin.Engine) {
	router.POST("/editor/:action", func(c *gin.Context) {
		action := c.Param("action")
		switch action {
		case "save":
			editor.SaveToDB(c)
		case "download":
			editor.Download(c)
		case "submit":
			editor.SubmitToDB(c)
		}
	})

	router.POST("/folder/:action", func(c *gin.Context) {
		action := c.Param("action")
		switch action {
		case "create":
			folder.CreateFolder(c)
		case "remove":
			folder.RemoveFolder(c)
		case "list":
			folder.GetFolderList(c)
		}
	})

	router.POST("/project/:action", func(c *gin.Context) {
		action := c.Param("action")
		switch action {
		case "create":
			// project.ProjectCreateHandeler(c)
		}
	})
}
