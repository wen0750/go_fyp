package hdcwe

import (
	"go_fyp/core/backend/services/database/cwe"
	"net/http"
	"strings"

	"regexp"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type input_ListOne struct {
	CVEID string `json:"cvwe_id"`
}

type input_Search struct {
	Keyword string `json:"keyword"`
}

type Out_ListOne struct {
}

type Out_ListAll struct {
}

type Out_Search struct {
}

func delChar(s []rune, start int, end int) string {
	if end > len(s) {
		end = len(s)
	}

	if start > 0 {
		if end == len(s) {
			return string(s[0 : start-1])
		} else {
			result := append(s[0:start-1], s[end+1:]...)
			return string(result)
		}
	} else {
		if end >= len(s) {
			return ""
		} else {
			result := s[end+1:]
			return string(result)
		}
	}
}

func Action_Search_QueryFormatter(srtingSorce string) bson.D {
	var filter []interface{}

	var cveid []string
	var cveid_year []string
	var dateYear []string

	cveRegexp, _ := regexp.Compile("CVE-[0-9]{4}-[0-9]{0,5}")
	cveid = cveRegexp.FindAllString(srtingSorce, -1)

	for _, s := range cveid {
		filter = append(filter, bson.M{"cveMetadata.cveId": s})

		e := cveRegexp.FindStringIndex(srtingSorce)
		r := []rune(srtingSorce)
		srtingSorce = delChar(r, e[0], e[1])
	}

	cveYearRegexp, _ := regexp.Compile("CVE-[0-9]{0,4}")
	cveid_year = cveYearRegexp.FindAllString(srtingSorce, -1)
	if len(cveid_year) > 0 {
		for _, s := range cveid_year {
			filter = append(filter, bson.M{"cveMetadata.cveId": primitive.Regex{Pattern: s}})

			e := cveYearRegexp.FindStringIndex(srtingSorce)
			r := []rune(srtingSorce)
			srtingSorce = delChar(r, e[0], e[1])
		}
	}

	dateYearRegexp, _ := regexp.Compile("[0-9]{4}")
	dateYear = dateYearRegexp.FindAllString(srtingSorce, -1)
	if len(dateYear) > 0 {
		for _, s := range dateYear {
			filter = append(filter, bson.M{"containers.cna.descriptions.value": primitive.Regex{Pattern: s}})

			e := dateYearRegexp.FindStringIndex(srtingSorce)
			r := []rune(srtingSorce)
			srtingSorce = delChar(r, e[0], e[1])
		}
	}

	split := strings.Split(srtingSorce, " ")
	if len(split) > 0 {
		for _, s := range split {
			if len(s) > 0 {
				filter = append(filter, bson.M{"containers.cna.descriptions.value": primitive.Regex{Pattern: s}})
			}
		}
	}
	return bson.D{{Key: "$or", Value: filter}}
}

func Action_ListAll(request *gin.Context) {
	// get data from database
	result, err := cwe.ListAll()
	if err != nil {
		request.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing cwe", "errors": err})
		return
	}

	request.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "result": result})
}

func Action_ListOne(request *gin.Context) {
	var inputData input_ListOne
	var cveid string

	// data format
	if err := request.ShouldBindJSON(&inputData); err != nil {
		// c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		request.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error(), "code": http.StatusInternalServerError, "errorCode": "1001"})
		return
	}

	// data validation
	if inputData.CVEID == "" {
		request.JSON(http.StatusInternalServerError, gin.H{"error": "empty input", "code": http.StatusInternalServerError, "errorCode": "1002"})
		return
	}

	regexp, _ := regexp.Compile("CWE-[0-9]{4}-[0-9]{4,5}")
	cveid = regexp.FindString(inputData.CVEID)
	if cveid == "" {
		request.JSON(http.StatusInternalServerError, gin.H{"error": "invalid input", "code": http.StatusInternalServerError, "errorCode": "1003"})
	}

	// get data from database
	result, err := cwe.ListOne(cveid)
	if err != nil {
		request.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing cwe", "code": http.StatusInternalServerError, "errorCode": "1004"})
		return
	}

	request.JSON(http.StatusOK, result)
}

func Action_Search(request *gin.Context) {
	var inputData input_Search
	var query bson.D

	// data format
	if err := request.ShouldBindJSON(&inputData); err != nil {
		request.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error(), "code": http.StatusInternalServerError, "errorCode": "1005"})
		return
	}

	// data validation
	if inputData.Keyword == "" {
		request.JSON(http.StatusInternalServerError, gin.H{"error": "empty input", "code": http.StatusInternalServerError, "errorCode": "1006"})
		return
	}

	// format user input as query
	query = Action_Search_QueryFormatter(inputData.Keyword)

	// get data from database
	result, err := cwe.Search(query)
	if err != nil {
		request.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing cwe", "code": http.StatusInternalServerError, "errorCode": "1008"})
		return
	}
	if result == nil {
		request.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "result": []int{}})
		return
	}
	request.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "result": result})
}
