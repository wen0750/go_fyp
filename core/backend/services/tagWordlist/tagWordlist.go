package tagWordlist

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"gopkg.in/yaml.v2"
)

type YamlFile struct {
	Info struct {
		Tags string `yaml:"tags"`
	} `yaml:"info"`
}

// Helper function to check if a path exists
func doesPathExist(path string) bool {
	_, err := os.Stat(path)
	if err == nil {
		return true
	}
	if os.IsNotExist(err) {
		return false
	}
	return false
}

func GetWordlist() {
	// Get the current file's path
	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	// Define the relative directory where the subdirectories with YAML files are
	relativeDirectory := "../tagWordlist/nuclei-templates/http/iot"

	// Convert relative path to absolute path
	directory := filepath.Join(dir, relativeDirectory)

	// Check if the directory exists
	if doesPathExist(directory) {
		fmt.Println("Directory exists")

	} else {
		fmt.Println("Directory does not exist")
	}

	err := filepath.Walk(directory, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Check if the file has a .yaml extension
		if filepath.Ext(path) == ".yaml" {
			// Read the file
			data, err := os.ReadFile(path)
			if err != nil {
				return err
			}

			// Unmarshal the YAML data
			var ymlFile YamlFile
			err = yaml.Unmarshal(data, &ymlFile)
			if err != nil {
				return err
			}
			// Split the tags string into individual tags
			tags := strings.Split(ymlFile.Info.Tags, ",")

			// Print the tags
			fmt.Println(tags)
		}

		return nil
	})

	if err != nil {
		fmt.Println("Error walking through directory:", err)
	}

}