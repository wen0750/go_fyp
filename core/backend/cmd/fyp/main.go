package main

import (
	"bufio"
	"fmt"
	"os"
	"os/signal"
	"runtime"
	"runtime/pprof"
	"strings"
	"time"

	"go_fyp_test/core/backend/internal/runner"
	"go_fyp_test/core/backend/pkg/catalog/config"
	"go_fyp_test/core/backend/pkg/operators/common/dsl"
	"go_fyp_test/core/backend/pkg/protocols/http"
	"go_fyp_test/core/backend/pkg/types"
	"go_fyp_test/core/backend/pkg/utils/monitor"

	"github.com/projectdiscovery/goflags"
	"github.com/projectdiscovery/gologger"
	"github.com/projectdiscovery/gologger/levels"
	errorutil "github.com/projectdiscovery/utils/errors"
	fileutil "github.com/projectdiscovery/utils/file"
)

var (
	cfgFile    string
	memProfile string // optional profile file path
	options    = &types.Options{}
)

func main() {
	if err := runner.ConfigureOptions(); err != nil {
		gologger.Fatal().Msgf("Could not initialize options: %s\n", err)
	}
	_ = readConfig()

	if options.ListDslSignatures {
		gologger.Info().Msgf("The available custom DSL functions are:")
		fmt.Println(dsl.GetPrintableDslFunctionSignatures(options.NoColor))
		return
	}

	// Profiling related code
	if memProfile != "" {
		f, err := os.Create(memProfile)
		if err != nil {
			gologger.Fatal().Msgf("profile: could not create memory profile %q: %v", memProfile, err)
		}
		old := runtime.MemProfileRate
		runtime.MemProfileRate = 4096
		gologger.Print().Msgf("profile: memory profiling enabled (rate %d), %s", runtime.MemProfileRate, memProfile)

		defer func() {
			_ = pprof.Lookup("heap").WriteTo(f, 0)
			f.Close()
			runtime.MemProfileRate = old
			gologger.Print().Msgf("profile: memory profiling disabled, %s", memProfile)
		}()
	}

	runner.ParseOptions(options)

	if options.HangMonitor {
		cancel := monitor.NewStackMonitor(10 * time.Second)
		defer cancel()
	}

	nucleiRunner, err := runner.New(options)
	if err != nil {
		gologger.Fatal().Msgf("Could not create runner: %s\n", err)
	}
	if nucleiRunner == nil {
		return
	}

	// Setup graceful exits
	resumeFileName := types.DefaultResumeFilePath()
	c := make(chan os.Signal, 1)
	defer close(c)
	signal.Notify(c, os.Interrupt)
	go func() {
		for range c {
			gologger.Info().Msgf("CTRL+C pressed: Exiting\n")
			nucleiRunner.Close()
			if options.ShouldSaveResume() {
				gologger.Info().Msgf("Creating resume file: %s\n", resumeFileName)
				err := nucleiRunner.SaveResumeConfig(resumeFileName)
				if err != nil {
					gologger.Error().Msgf("Couldn't create resume file: %s\n", err)
				}
			}
			os.Exit(1)
		}
	}()

	if err := nucleiRunner.RunEnumeration(); err != nil {
		if options.Validate {
			gologger.Fatal().Msgf("Could not validate templates: %s\n", err)
		} else {
			gologger.Fatal().Msgf("Could not run nuclei: %s\n", err)
		}
	}
	nucleiRunner.Close()
	// on successful execution remove the resume file in case it exists
	if fileutil.FileExists(resumeFileName) {
		os.Remove(resumeFileName)
	}
}

func readConfig() *goflags.FlagSet {
	flagSet := goflags.NewFlagSet()
	flagSet.CaseSensitive = true
	flagSet.SetDescription(`Nuclei is a fast, template based vulnerability scanner focusing
	n extensive configurability, massive extensibility and ease of use.`)

	options.RateLimitMinute = 0
	options.Retries = 1
	options.InteractionsPollDuration = 5
	options.InteractionsCoolDownPeriod = 5
	options.StatsInterval = 5
	options.MaxRedirects = 10
	options.HeadlessBulkSize = 10
	options.HeadlessTemplateThreads = 10
	options.Timeout = 10
	options.PageTimeout = 20
	options.BulkSize = 25
	options.TemplateThreads = 25
	options.MaxHostError = 30
	options.InteractionsEviction = 60
	options.UncoverRateLimit = 60
	options.UncoverLimit = 100
	options.OutputLimit = 100
	options.RateLimit = 150
	options.InteractionsCacheSize = 5000
	options.MetricsPort = 9092
	options.TargetsFilePath = ""
	options.Resume = ""
	options.Output = ""
	options.ReportingDB = ""
	options.MarkdownExportDirectory = ""
	options.SarifExport = ""
	options.JSONExport = ""
	options.JSONLExport = ""
	cfgFile = ""
	options.ReportingConfig = ""
	options.ResolversFile = ""
	options.ClientCertFile = ""
	options.ClientKeyFile = ""
	options.ClientCAFile = ""
	options.Interface = ""
	options.AttackType = ""
	options.SourceIP = ""
	options.CustomConfigDir = ""
	options.InteractshURL = ""
	options.InteractshToken = ""
	options.FuzzingType = ""
	options.FuzzingMode = ""
	options.TraceLogFile = ""
	options.ErrorLogFile = ""
	memProfile = ""
	options.NewTemplatesDirectory = ""
	options.AddDatasource = ""
	options.AddTarget = ""
	options.AddTemplate = ""
	options.ScanOutput = ""
	options.DeleteScan = ""
	options.RemoveTarget = ""
	options.RemoveTemplate = ""
	options.RemoveDatasource = ""
	options.DisableReportingSource = ""
	options.EnableReportingSource = ""
	options.GetTarget = ""
	options.GetTemplate = ""
	options.UncoverField = "ip:port"
	options.RemoteTemplateDomainList = []string{"api.nuclei.sh"}
	options.ResponseSaveSize = 1 * 1024 * 1024
	options.ResponseReadSize = 10 * 1024 * 1024
	options.ScanAllIPs = false
	options.NewTemplates = false
	options.AutomaticScan = false
	options.Validate = false
	options.NoStrictSyntax = false
	options.TemplateDisplay = false
	options.TemplateList = false
	options.StoreResponse = false
	options.Silent = false
	options.NoColor = false
	options.JSONL = false
	options.OmitRawRequests = false
	options.NoMeta = false
	options.Timestamp = false
	options.MatcherStatus = false
	options.FollowRedirects = false
	options.FollowHostRedirects = false
	options.DisableRedirects = false
	options.SystemResolvers = false
	options.DisableClustering = false
	options.ForceAttemptHTTP2 = false
	options.EnvironmentVariables = false
	options.ShowMatchLine = false
	options.ZTLS = false
	options.AllowLocalFileAccess = false
	options.RestrictLocalNetworkAccess = false
	options.TlsImpersonate = false
	options.NoInteractsh = false
	options.Uncover = false
	options.LeaveDefaultPorts = false
	options.NoHostErrors = false
	options.Project = false
	options.StopAtFirstMatch = false
	options.Stream = false
	options.DisableHTTPProbe = false
	options.DisableStdin = false
	options.Headless = false
	options.ShowBrowser = false
	options.UseInstalledChrome = false
	options.ShowActions = false
	options.Debug = false
	options.DebugRequests = false
	options.DebugResponse = false
	options.ProxyInternal = false
	options.ListDslSignatures = false
	options.HangMonitor = false
	options.Verbose = false
	options.VerboseVerbose = false
	options.ShowVarDump = false
	options.EnablePprof = false
	options.HealthCheck = false
	options.UpdateTemplates = false
	options.EnableProgressBar = false
	options.StatsJSON = false
	options.Metrics = false
	options.Cloud = false
	options.ScanList = false
	options.ListTargets = false
	options.ListTemplates = false
	options.ListDatasources = false
	options.ListReportingSources = false
	options.NoStore = false
	options.NoTables = false
	options.Targets = nil
	options.IPVersion = nil
	options.NewTemplatesWithVersion = nil
	options.Templates = nil
	options.TemplateURLs = nil
	options.Workflows = nil
	options.WorkflowURLs = nil
	options.Authors = nil
	options.Tags = nil
	options.ExcludeTags = nil
	options.IncludeTags = nil
	options.IncludeIds = nil
	options.ExcludeIds = nil
	options.IncludeTemplates = nil
	options.ExcludedTemplates = nil
	options.ExcludeMatchers = nil
	options.IncludeConditions = nil
	options.CustomHeaders = nil
	options.Vars = nil
	options.UncoverQuery = nil
	options.UncoverEngine = nil
	options.TrackError = nil
	options.Proxy = nil
	options.ProjectPath = os.TempDir()
	options.StoreResponseDir = runner.DefaultDumpTrafficOutputFolder
	options.InputReadTimeout = time.Duration(3 * time.Minute)
	options.JSONRequests = true
	options.ScanStrategy = goflags.EnumVariable(0)

	flagSet := goflags.NewFlagSet()

	_ = flagSet.Parse()

	gologger.DefaultLogger.SetTimestamp(options.Timestamp, levels.LevelDebug)

	if options.LeaveDefaultPorts {
		http.LeaveDefaultPorts = true
	}
	if options.CustomConfigDir != "" {
		config.DefaultConfig.SetConfigDir(options.CustomConfigDir)
		readFlagsConfig(flagSet)
	}
	if cfgFile != "" {
		if !fileutil.FileExists(cfgFile) {
			gologger.Fatal().Msgf("given config file '%s' does not exist", cfgFile)
		}
		// merge config file with flags
		if err := flagSet.MergeConfigFile(cfgFile); err != nil {
			gologger.Fatal().Msgf("Could not read config: %s\n", err)
		}
	}
	if options.NewTemplatesDirectory != "" {
		config.DefaultConfig.SetTemplatesDir(options.NewTemplatesDirectory)
	}

	cleanupOldResumeFiles()
	return flagSet
}

// cleanupOldResumeFiles cleans up resume files older than 10 days.
func cleanupOldResumeFiles() {
	root := config.DefaultConfig.GetConfigDir()
	filter := fileutil.FileFilters{
		OlderThan: 24 * time.Hour * 10, // cleanup on the 10th day
		Prefix:    "resume-",
	}
	_ = fileutil.DeleteFilesOlderThan(root, filter)
}

// readFlagsConfig reads the config file from the default config dir and copies it to the current config dir.
func readFlagsConfig(flagset *goflags.FlagSet) {
	// check if config.yaml file exists
	defaultCfgFile, err := flagset.GetConfigFilePath()
	if err != nil {
		// something went wrong either dir is not readable or something else went wrong upstream in `goflags`
		// warn and exit in this case
		gologger.Warning().Msgf("Could not read config file: %s\n", err)
		return
	}
	cfgFile := config.DefaultConfig.GetFlagsConfigFilePath()
	if !fileutil.FileExists(cfgFile) {
		if !fileutil.FileExists(defaultCfgFile) {
			// if default config does not exist, warn and exit
			gologger.Warning().Msgf("missing default config file : %s", defaultCfgFile)
			return
		}
		// if does not exist copy it from the default config
		if err = fileutil.CopyFile(defaultCfgFile, cfgFile); err != nil {
			gologger.Warning().Msgf("Could not copy config file: %s\n", err)
		}
		return
	}
	// if config file exists, merge it with the default config
	if err = flagset.MergeConfigFile(cfgFile); err != nil {
		gologger.Warning().Msgf("failed to merge configfile with flags got: %s\n", err)
	}
}

// disableUpdatesCallback disables the update check.
func disableUpdatesCallback() {
	config.DefaultConfig.DisableUpdateCheck()
}

// printVersion prints the nuclei version and exits.
func printVersion() {
	gologger.Info().Msgf("Nuclei Engine Version: %s", config.Version)
	os.Exit(0)
}

// printTemplateVersion prints the nuclei template version and exits.
func printTemplateVersion() {
	cfg := config.DefaultConfig
	gologger.Info().Msgf("Public nuclei-templates version: %s (%s)\n", cfg.TemplateVersion, cfg.TemplatesDirectory)

	if fileutil.FolderExists(cfg.CustomS3TemplatesDirectory) {
		gologger.Info().Msgf("Custom S3 templates location: %s\n", cfg.CustomS3TemplatesDirectory)
	}
	if fileutil.FolderExists(cfg.CustomGithubTemplatesDirectory) {
		gologger.Info().Msgf("Custom Github templates location: %s ", cfg.CustomGithubTemplatesDirectory)
	}
	if fileutil.FolderExists(cfg.CustomGitLabTemplatesDirectory) {
		gologger.Info().Msgf("Custom Gitlab templates location: %s ", cfg.CustomGitLabTemplatesDirectory)
	}
	if fileutil.FolderExists(cfg.CustomAzureTemplatesDirectory) {
		gologger.Info().Msgf("Custom Azure templates location: %s ", cfg.CustomAzureTemplatesDirectory)
	}
	os.Exit(0)
}

func resetCallback() {
	warning := fmt.Sprintf(`
Using '-reset' will delete all nuclei configurations files and all nuclei-templates

Following files will be deleted:
1. All Config + Resumes files at %v
2. All nuclei-templates at %v

Note: Make sure you have backup of your custom nuclei-templates before proceeding

`, config.DefaultConfig.GetConfigDir(), config.DefaultConfig.TemplatesDirectory)
	gologger.Print().Msg(warning)
	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Print("Are you sure you want to continue? [y/n]: ")
		resp, err := reader.ReadString('\n')
		if err != nil {
			gologger.Fatal().Msgf("could not read response: %s", err)
		}
		resp = strings.TrimSpace(resp)
		if strings.EqualFold(resp, "y") || strings.EqualFold(resp, "yes") {
			break
		}
		if strings.EqualFold(resp, "n") || strings.EqualFold(resp, "no") || resp == "" {
			fmt.Println("Exiting...")
			os.Exit(0)
		}
	}
	err := os.RemoveAll(config.DefaultConfig.GetConfigDir())
	if err != nil {
		gologger.Fatal().Msgf("could not delete config dir: %s", err)
	}
	err = os.RemoveAll(config.DefaultConfig.TemplatesDirectory)
	if err != nil {
		gologger.Fatal().Msgf("could not delete templates dir: %s", err)
	}
	gologger.Info().Msgf("Successfully deleted all nuclei configurations files and nuclei-templates")
	os.Exit(0)
}

func init() {
	// print stacktrace of errors in debug mode
	if strings.EqualFold(os.Getenv("DEBUG"), "true") {
		errorutil.ShowStackTrace = true
	}
}
