package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"path"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/logrusorgru/aurora"
	"github.com/pkg/errors"
	"github.com/projectdiscovery/goflags"
	"github.com/projectdiscovery/ratelimit"
	"go_fyp_test/core/backend/pkg/catalog/config"
	"go_fyp_test/core/backend/pkg/catalog/disk"
	"go_fyp_test/core/backend/pkg/catalog/loader"
	"go_fyp_test/core/backend/pkg/core"
	"go_fyp_test/core/backend/pkg/core/inputs"
	"go_fyp_test/core/backend/pkg/output"
	"go_fyp_test/core/backend/pkg/parsers"
	"go_fyp_test/core/backend/pkg/protocols"
	"go_fyp_test/core/backend/pkg/protocols/common/contextargs"
	"go_fyp_test/core/backend/pkg/protocols/common/hosterrorscache"
	"go_fyp_test/core/backend/pkg/protocols/common/interactsh"
	"go_fyp_test/core/backend/pkg/protocols/common/protocolinit"
	"go_fyp_test/core/backend/pkg/protocols/common/protocolstate"
	"go_fyp_test/core/backend/pkg/reporting"
	"go_fyp_test/core/backend/pkg/testutils"
	"go_fyp_test/core/backend/pkg/types"
)

var codeTestcases = []TestCaseInfo{
	{Path: "code/test.yaml", TestCase: &goIntegrationTest{}},
	{Path: "code/test.json", TestCase: &goIntegrationTest{}},
}

type goIntegrationTest struct{}

// Execute executes a test case and returns an error if occurred
//
// Execute the docs at ../DESIGN.md if the code stops working for integration.
func (h *goIntegrationTest) Execute(templatePath string) error {
	router := httprouter.New()

	router.GET("/", func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		fmt.Fprintf(w, "This is test matcher text")
		if strings.EqualFold(r.Header.Get("test"), "nuclei") {
			fmt.Fprintf(w, "This is test headers matcher text")
		}
	})
	ts := httptest.NewServer(router)
	defer ts.Close()

	results, err := executeNucleiAsCode(templatePath, ts.URL)
	if err != nil {
		return err
	}
	return expectResultsCount(results, 1)
}

// executeNucleiAsCode contains an example
func executeNucleiAsCode(templatePath, templateURL string) ([]string, error) {
	cache := hosterrorscache.New(30, hosterrorscache.DefaultMaxHostsCount, nil)
	defer cache.Close()

	mockProgress := &testutils.MockProgressClient{}
	reportingClient, err := reporting.New(&reporting.Options{}, "")
	if err != nil {
		return nil, err
	}
	defer reportingClient.Close()

	outputWriter := testutils.NewMockOutputWriter()
	var results []string
	outputWriter.WriteCallback = func(event *output.ResultEvent) {
		results = append(results, fmt.Sprintf("%v\n", event))
	}

	defaultOpts := types.DefaultOptions()
	_ = protocolstate.Init(defaultOpts)
	_ = protocolinit.Init(defaultOpts)

	defaultOpts.Templates = goflags.StringSlice{templatePath}
	defaultOpts.ExcludeTags = config.ReadIgnoreFile().Tags

	interactOpts := interactsh.DefaultOptions(outputWriter, reportingClient, mockProgress)
	interactClient, err := interactsh.New(interactOpts)
	if err != nil {
		return nil, errors.Wrap(err, "could not create interact client")
	}
	defer interactClient.Close()

	home, _ := os.UserHomeDir()
	catalog := disk.NewCatalog(path.Join(home, "nuclei-templates"))
	ratelimiter := ratelimit.New(context.Background(), 150, time.Second)
	defer ratelimiter.Stop()
	executerOpts := protocols.ExecutorOptions{
		Output:          outputWriter,
		Options:         defaultOpts,
		Progress:        mockProgress,
		Catalog:         catalog,
		IssuesClient:    reportingClient,
		RateLimiter:     ratelimiter,
		Interactsh:      interactClient,
		HostErrorsCache: cache,
		Colorizer:       aurora.NewAurora(true),
		ResumeCfg:       types.NewResumeCfg(),
	}
	engine := core.New(defaultOpts)
	engine.SetExecuterOptions(executerOpts)

	workflowLoader, err := parsers.NewLoader(&executerOpts)
	if err != nil {
		log.Fatalf("Could not create workflow loader: %s\n", err)
	}
	executerOpts.WorkflowLoader = workflowLoader

	store, err := loader.New(loader.NewConfig(defaultOpts, catalog, executerOpts))
	if err != nil {
		return nil, errors.Wrap(err, "could not create loader")
	}
	store.Load()

	input := &inputs.SimpleInputProvider{Inputs: []*contextargs.MetaInput{{Input: templateURL}}}
	_ = engine.Execute(store.Templates(), input)
	engine.WorkPool().Wait() // Wait for the scan to finish

	return results, nil
}
