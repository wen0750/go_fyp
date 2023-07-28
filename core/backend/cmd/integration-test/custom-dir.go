package main

import (
	"os"

	"go_fyp_test/core/backend/pkg/testutils"
)

type customConfigDirTest struct{}

var customConfigDirTestCases = map[string]testutils.TestCase{
	"dns/cname-fingerprint.yaml": &customConfigDirTest{},
}

// Execute executes a test case and returns an error if occurred
func (h *customConfigDirTest) Execute(filePath string) error {
	customTempDirectory, err := os.MkdirTemp("", "")
	if err != nil {
		return err
	}
	defer os.RemoveAll(customTempDirectory)
	results, err := testutils.RunNucleiTemplateAndGetResults(filePath, "8x8exch02.8x8.com", debug, "-config-directory", customTempDirectory)
	if err != nil {
		return err
	}
	if len(results) == 0 {
		return nil
	}
	files, err := os.ReadDir(customTempDirectory)
	if err != nil {
		return err
	}
	var fileNames []string
	for _, file := range files {
		fileNames = append(fileNames, file.Name())
	}
	return expectResultsCount(fileNames, 4)
}
