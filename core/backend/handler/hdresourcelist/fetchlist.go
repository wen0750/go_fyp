package hdresourcelist

import (
	"go_fyp/core/backend/services/urlresponse"
	"net/http"

	"github.com/gin-gonic/gin"
)

type input_URL struct {
	URL string `json:"url"`
}

type Out_Search struct {
}

func Fetch(request *gin.Context) {
	var inputData input_URL

	// data format
	if err := request.ShouldBindJSON(&inputData); err != nil {
		request.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error(), "code": http.StatusInternalServerError, "errorCode": "1030"})
		return
	}

	// data validation
	if inputData.URL == "" {
		request.JSON(http.StatusInternalServerError, gin.H{"error": "empty input", "code": http.StatusInternalServerError, "errorCode": "1031"})
		return
	}

	// get data from database
	result, htmlbody, err := urlresponse.Run(inputData.URL)
	if err != nil {
		request.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing cwe", "code": http.StatusInternalServerError, "errorCode": "1008"})
		return
	}
	if result == nil {
		request.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "result": []int{}})
		return
	}
	request.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "result": result, "body": htmlbody})
}
