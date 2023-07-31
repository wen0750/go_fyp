package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/logrusorgru/aurora"

	"github.com/projectdiscovery/goflags"
	"github.com/projectdiscovery/httpx/common/httpx"
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

func main() {
	cache := hosterrorscache.New(30, hosterrorscache.DefaultMaxHostsCount, nil)
	defer cache.Close()

	mockProgress := &testutils.MockProgressClient{}
	reportingClient, _ := reporting.New(&reporting.Options{}, "")
	defer reportingClient.Close()

	outputWriter := testutils.NewMockOutputWriter()
	outputWriter.WriteCallback = func(event *output.ResultEvent) {
		fmt.Printf("Got Result: %v\n", event)
	}

	defaultOpts := types.DefaultOptions()
	protocolstate.Init(defaultOpts)
	protocolinit.Init(defaultOpts)

	defaultOpts.IncludeIds = goflags.StringSlice{"cname-service", "tech-detect"}
	defaultOpts.ExcludeTags = config.ReadIgnoreFile().Tags

	interactOpts := interactsh.DefaultOptions(outputWriter, reportingClient, mockProgress)
	interactClient, err := interactsh.New(interactOpts)
	if err != nil {
		log.Fatalf("Could not create interact client: %s\n", err)
	}
	defer interactClient.Close()

	home, _ := os.UserHomeDir()
	catalog := disk.NewCatalog(filepath.Join(home, "nuclei-templates"))
	executerOpts := protocols.ExecutorOptions{
		Output:          outputWriter,
		Options:         defaultOpts,
		Progress:        mockProgress,
		Catalog:         catalog,
		IssuesClient:    reportingClient,
		RateLimiter:     ratelimit.New(context.Background(), 150, time.Second),
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
		log.Fatalf("Could not create loader client: %s\n", err)
	}
	store.Load()

	// flat input without probe
	inputArgs := []*contextargs.MetaInput{{Input: "docs.hackerone.com"}}
	input := &inputs.SimpleInputProvider{Inputs: inputArgs}

	httpxOptions := httpx.DefaultOptions
	httpxOptions.Timeout = 5 * time.Second
	httpxClient, err := httpx.New(&httpxOptions)
	if err != nil {
		log.Fatal(err)
	}

	// use httpx to probe the URL => https://scanme.sh
	input.SetWithProbe("scanme.sh", httpxClient)

	_ = engine.Execute(store.Templates(), input)
	engine.WorkPool().Wait() // Wait for the scan to finish
}
