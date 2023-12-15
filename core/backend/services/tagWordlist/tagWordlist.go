package tagWordlist

import (
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func GetWordlist() {
	url := "https://raw.githubusercontent.com/projectdiscovery/nuclei-templates/main/TEMPLATES-STATS.json"
	output := "../backend/services/tagWordlist/tagList.json" // Updated output path

	// Ensure that the directory exists
	outputDir := filepath.Dir(output)
	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
		panic(err)
	}

	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		panic("Server returned non-200 status code")
	}

	outFile, err := os.Create(output)
	if err != nil {
		panic(err)
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, resp.Body)
	if err != nil {
		panic(err)
	}

	println("File downloaded successfully as", output)
}

func Action_Search (c *gin.Context){

}