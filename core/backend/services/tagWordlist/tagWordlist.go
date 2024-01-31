package tagWordlist

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/gin-gonic/gin"
)

// Tag structure to match the JSON "tags" array
type Tag struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

// TagsData to match the top-level JSON object containing the "tags" array
type TagsData struct {
	Tags  []Tag `json:"tags"`
	Types []struct {
		Name  string `json:"name"`
		Count int    `json:"count"`
	} `json:"types"`
}

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

// Read the JSON file and return the top 15 tags
func Top15Tags(c *gin.Context) {
	// Read the file
	filePath := "../backend/services/tagWordlist/tagList.json"
	data, err := os.ReadFile(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Unmarshal JSON data
	var tagsData TagsData
	if err := json.Unmarshal(data, &tagsData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Sort the tags by count, descending
	sort.Slice(tagsData.Tags, func(i, j int) bool {
		return tagsData.Tags[i].Count > tagsData.Tags[j].Count
	})

	// Get the top 15 tags
	topTags := tagsData.Tags
	if len(topTags) > 15 {
		topTags = topTags[:15]
	}

	// Send the top tags as a JSON response
	c.JSON(http.StatusOK, topTags)
}

func Action_Search(c *gin.Context) {
	// Assume 'query' is the query parameter with the user's current input
	query := c.Query("q")

	if query == "" {
		// If the query is empty, call the Top15Tags function
		Top15Tags(c)
		return
	}

	// Read the file
	filePath := "../backend/services/tagWordlist/tagList.json"
	data, err := os.ReadFile(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read tag list."})
		return
	}

	// Unmarshal JSON data into a TagsData struct
	var tagsData TagsData
	if err := json.Unmarshal(data, &tagsData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse tag list."})
		return
	}

	// Filter tags starting with the query prefix and limit to first 15
	var suggestions []string
	lowerQuery := strings.ToLower(query)
	for _, tag := range tagsData.Tags {
		if strings.HasPrefix(strings.ToLower(tag.Name), lowerQuery) {
			suggestions = append(suggestions, tag.Name)
			if len(suggestions) >= 15 {
				break
			}
		}
	}

	// Return the suggestions as a JSON response
	c.JSON(http.StatusOK, gin.H{"suggestions": suggestions})
}
