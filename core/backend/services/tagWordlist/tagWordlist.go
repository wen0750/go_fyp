package tagWordlist

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func GetWordlist() error {
	url := "https://raw.githubusercontent.com/projectdiscovery/nuclei-templates/main/TEMPLATES-STATS.json"
	output := "../backend/services/tagWordlist/tagList.json"
	
	outputDir := filepath.Dir(output)
	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
		return err 
	}

	resp, err := http.Get(url)
	if err != nil {
		return err 
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("server returned non-200 status code: %d", resp.StatusCode) // Return an error with the status code
	}

	outFile, err := os.Create(output)
	if err != nil {
		return err 
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, resp.Body)
	if err != nil {
		return err 
	}

	println("File downloaded successfully as", output)
	return nil 
}


func Action_Search (c *gin.Context){

}