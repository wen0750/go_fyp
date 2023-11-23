package router

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	cve "go_fyp/core/backend/handler/hdcve"
	"go_fyp/core/backend/models/editor"
	"go_fyp/core/backend/models/folder"
	"go_fyp/core/backend/models/project"
	"go_fyp/core/backend/services/tagWordlist"
)

func Initialize() {
	//tagWordlist.GetWordlist()
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
			editor.UploadToDB(c)
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
		case "details":
			folder.GetFolderDetail(c)
		// retrieve all templates from database for button "Create Project"
		case "getTemplates":
			folder.GetTemplates(c)
		}
	})

	router.POST("/project/:action", func(c *gin.Context) {
		action := c.Param("action")

		switch action {
		case "createProject":
			project.ProjectCreateHandler(c)
		case "startScan":
			project.StartScan(c)
		case "remove":
			project.RemoveProjectFromFolder(c)
		}
	})

	router.GET("/project/:scanResult", func(c *gin.Context) {
		pid := c.Param("scanResult")
		project.GetScanResultSummary(c, pid)
		log.Printf("%s",pid)
		
	})

	router.POST("/cve/:action", func(c *gin.Context) {
		action := c.Param("action")
		switch action {
		case "list":
			cve.Action_ListOne(c)
		case "lists":
			cve.Action_ListAll(c)
		case "search":
			cve.Action_Search(c)
		}
	})
	router.POST("/cwe/:action", func(c *gin.Context) {
		action := c.Param("action")
		switch action {
		case "list":
			cve.Action_ListOne(c)
		case "lists":
			cve.Action_ListAll(c)
		case "search":
			cve.Action_Search(c)
		}
	})
	router.POST("/tag/:action", func(c *gin.Context) {
		action := c.Param("action")
		switch action {
		case "file":
			c.File("../services/tagList.txt")
		case "search":
			tagWordlist.Action_Search(c)
		}
		
	})
}
