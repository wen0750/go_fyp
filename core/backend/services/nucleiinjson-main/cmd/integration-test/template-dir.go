package main

import (
	"os"

	errorutil "github.com/projectdiscovery/utils/errors"
	"github.com/wen0750/nucleiinjson/pkg/testutils"
)

var templatesDirTestCases = []TestCaseInfo{
	{Path: "dns/cname-fingerprint.yaml", TestCase: &templateDirWithTargetTest{}},
}

type templateDirWithTargetTest struct{}

// Execute executes a test case and returns an error if occurred
func (h *templateDirWithTargetTest) Execute(filePath string) error {
	tempdir, err := os.MkdirTemp("", "nuclei-update-dir-*")
	if err != nil {
		return errorutil.NewWithErr(err).Msgf("failed to create temp dir")
	}
	defer os.RemoveAll(tempdir)

	results, err := testutils.RunNucleiTemplateAndGetResults(filePath, "8x8exch02.8x8.com", debug, "-ud", tempdir)
	if err != nil {
		return err
	}

	return expectResultsCount(results, 1)
}
