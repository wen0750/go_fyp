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
	"github.com/wen0750/nucleiinjson/pkg/catalog/config"
	"github.com/wen0750/nucleiinjson/pkg/catalog/disk"
	"github.com/wen0750/nucleiinjson/pkg/catalog/loader"
	"github.com/wen0750/nucleiinjson/pkg/core"
	"github.com/wen0750/nucleiinjson/pkg/core/inputs"
	"github.com/wen0750/nucleiinjson/pkg/output"
	"github.com/wen0750/nucleiinjson/pkg/parsers"
	"github.com/wen0750/nucleiinjson/pkg/protocols"
	"github.com/wen0750/nucleiinjson/pkg/protocols/common/contextargs"
	"github.com/wen0750/nucleiinjson/pkg/protocols/common/hosterrorscache"
	"github.com/wen0750/nucleiinjson/pkg/protocols/common/interactsh"
	"github.com/wen0750/nucleiinjson/pkg/protocols/common/protocolinit"
	"github.com/wen0750/nucleiinjson/pkg/protocols/common/protocolstate"
	"github.com/wen0750/nucleiinjson/pkg/reporting"
	"github.com/wen0750/nucleiinjson/pkg/testutils"
	"github.com/wen0750/nucleiinjson/pkg/types"
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
