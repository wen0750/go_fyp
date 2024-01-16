package router

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	cve "go_fyp/core/backend/handler/hdcve"
	fetchResourceList "go_fyp/core/backend/handler/hdresourcelist"
	"go_fyp/core/backend/models/editor"
	"go_fyp/core/backend/models/folder"
	"go_fyp/core/backend/models/project"
	templates "go_fyp/core/backend/models/template"
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
		}
	})

	router.POST("/template/:action", func(c *gin.Context) {
		action := c.Param("action")
		switch action {
		case "getTemplatesList":
			templates.GetTemplatesList(c)
		case "getTemplatesDetails":
			templates.GetTemplatesDetails(c)
		}
	})

	router.POST("/project/:action", func(c *gin.Context) {
		action := c.Param("action")

		switch action {
		case "createProject":
			project.ProjectCreateHandler(c)
		case "updateProject":
			project.UpdateProject(c)
		case "startScan":
			project.StartScan(c)
		case "remove":
			project.RemoveProjectFromFolder(c)
		}
	})

	//Lastest scan result
	router.GET("/project/:scanResult", func(c *gin.Context) {
		pid := c.Param("scanResult")
		project.GetLatestScanResultSummary(c, pid)
		log.Printf("%s", pid)
	})

	//Scan History List
	router.GET("/historyList/:list", func(c *gin.Context) {
		pid := c.Param("list")
		project.GetScanHistoryList(c, pid)
		log.Printf("%s", pid)
	})

	//select one from Scan History List
	router.GET("/historyOne/:scanResult", func(c *gin.Context) {
		hid := c.Param("scanResult")
		project.GetScanResultByHistoryId(c, hid)

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
		case "defaultShow":
			tagWordlist.Top15Tags(c)
		case "search":
			tagWordlist.Action_Search(c)
		}
	})

	router.POST("/pageresponse/:action", func(c *gin.Context) {
		action := c.Param("action")
		switch action {
		case "capture":
			fetchResourceList.Fetch(c)
		}
	})
}
