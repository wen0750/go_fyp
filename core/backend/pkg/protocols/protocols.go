package protocols

import (
	"github.com/projectdiscovery/ratelimit"

	"github.com/logrusorgru/aurora"

	"go_fyp_test/core/backend/pkg/catalog"
	"go_fyp_test/core/backend/pkg/input"
	"go_fyp_test/core/backend/pkg/model"
	"go_fyp_test/core/backend/pkg/operators"
	"go_fyp_test/core/backend/pkg/operators/extractors"
	"go_fyp_test/core/backend/pkg/operators/matchers"
	"go_fyp_test/core/backend/pkg/output"
	"go_fyp_test/core/backend/pkg/progress"
	"go_fyp_test/core/backend/pkg/projectfile"
	"go_fyp_test/core/backend/pkg/protocols/common/contextargs"
	"go_fyp_test/core/backend/pkg/protocols/common/hosterrorscache"
	"go_fyp_test/core/backend/pkg/protocols/common/interactsh"
	"go_fyp_test/core/backend/pkg/protocols/common/utils/excludematchers"
	"go_fyp_test/core/backend/pkg/protocols/common/variables"
	"go_fyp_test/core/backend/pkg/protocols/headless/engine"
	"go_fyp_test/core/backend/pkg/reporting"
	templateTypes "go_fyp_test/core/backend/pkg/templates/types"
	"go_fyp_test/core/backend/pkg/types"
)

// Executer is an interface implemented any protocol based request executer.
type Executer interface {
	// Compile compiles the execution generators preparing any requests possible.
	Compile() error
	// Requests returns the total number of requests the rule will perform
	Requests() int
	// Execute executes the protocol group and returns true or false if results were found.
	Execute(input *contextargs.Context) (bool, error)
	// ExecuteWithResults executes the protocol requests and returns results instead of writing them.
	ExecuteWithResults(input *contextargs.Context, callback OutputEventCallback) error
}

// ExecutorOptions contains the configuration options for executer clients
type ExecutorOptions struct {
	// TemplateID is the ID of the template for the request
	TemplateID string
	// TemplatePath is the path of the template for the request
	TemplatePath string
	// TemplateInfo contains information block of the template request
	TemplateInfo model.Info
	// Output is a writer interface for writing output events from executer.
	Output output.Writer
	// Options contains configuration options for the executer.
	Options *types.Options
	// IssuesClient is a client for nuclei issue tracker reporting
	IssuesClient reporting.Client
	// Progress is a progress client for scan reporting
	Progress progress.Progress
	// RateLimiter is a rate-limiter for limiting sent number of requests.
	RateLimiter *ratelimit.Limiter
	// Catalog is a template catalog implementation for nuclei
	Catalog catalog.Catalog
	// ProjectFile is the project file for nuclei
	ProjectFile *projectfile.ProjectFile
	// Browser is a browser engine for running headless templates
	Browser *engine.Browser
	// Interactsh is a client for interactsh oob polling server
	Interactsh *interactsh.Client
	// HostErrorsCache is an optional cache for handling host errors
	HostErrorsCache hosterrorscache.CacheInterface
	// Stop execution once first match is found (Assigned while parsing templates)
	// Note: this is different from Options.StopAtFirstMatch (Assigned from CLI option)
	StopAtFirstMatch bool
	// Variables is a list of variables from template
	Variables variables.Variable
	// Constants is a list of constants from template
	Constants map[string]interface{}
	// ExcludeMatchers is the list of matchers to exclude
	ExcludeMatchers *excludematchers.ExcludeMatchers
	// InputHelper is a helper for input normalization
	InputHelper *input.Helper

	Operators []*operators.Operators // only used by offlinehttp module

	// DoNotCache bool disables optional caching of the templates structure
	DoNotCache bool

	Colorizer      aurora.Aurora
	WorkflowLoader model.WorkflowLoader
	ResumeCfg      *types.ResumeCfg
}

// Copy returns a copy of the executeroptions structure
func (e ExecutorOptions) Copy() ExecutorOptions {
	copy := e
	return copy
}

// Request is an interface implemented any protocol based request generator.
type Request interface {
	// Compile compiles the request generators preparing any requests possible.
	Compile(options *ExecutorOptions) error
	// Requests returns the total number of requests the rule will perform
	Requests() int
	// GetID returns the ID for the request if any. IDs are used for multi-request
	// condition matching. So, two requests can be sent and their match can
	// be evaluated from the third request by using the IDs for both requests.
	GetID() string
	// Match performs matching operation for a matcher on model and returns:
	// true and a list of matched snippets if the matcher type is supports it
	// otherwise false and an empty string slice
	Match(data map[string]interface{}, matcher *matchers.Matcher) (bool, []string)
	// Extract performs extracting operation for an extractor on model and returns true or false.
	Extract(data map[string]interface{}, matcher *extractors.Extractor) map[string]struct{}
	// ExecuteWithResults executes the protocol requests and returns results instead of writing them.
	ExecuteWithResults(input *contextargs.Context, dynamicValues, previous output.InternalEvent, callback OutputEventCallback) error
	// MakeResultEventItem creates a result event from internal wrapped event. Intended to be used by MakeResultEventItem internally
	MakeResultEventItem(wrapped *output.InternalWrappedEvent) *output.ResultEvent
	// MakeResultEvent creates a flat list of result events from an internal wrapped event, based on successful matchers and extracted data
	MakeResultEvent(wrapped *output.InternalWrappedEvent) []*output.ResultEvent
	// GetCompiledOperators returns a list of the compiled operators
	GetCompiledOperators() []*operators.Operators
	// Type returns the type of the protocol request
	Type() templateTypes.ProtocolType
}

// OutputEventCallback is a callback event for any results found during scanning.
type OutputEventCallback func(result *output.InternalWrappedEvent)

func MakeDefaultResultEvent(request Request, wrapped *output.InternalWrappedEvent) []*output.ResultEvent {
	if len(wrapped.OperatorsResult.DynamicValues) > 0 && !wrapped.OperatorsResult.Matched {
		return nil
	}

	results := make([]*output.ResultEvent, 0, len(wrapped.OperatorsResult.Matches)+1)

	// If we have multiple matchers with names, write each of them separately.
	if len(wrapped.OperatorsResult.Matches) > 0 {
		for matcherNames := range wrapped.OperatorsResult.Matches {
			data := request.MakeResultEventItem(wrapped)
			data.MatcherName = matcherNames
			results = append(results, data)
		}
	} else if len(wrapped.OperatorsResult.Extracts) > 0 {
		for k, v := range wrapped.OperatorsResult.Extracts {
			data := request.MakeResultEventItem(wrapped)
			data.ExtractorName = k
			data.ExtractedResults = v
			results = append(results, data)
		}
	} else {
		data := request.MakeResultEventItem(wrapped)
		results = append(results, data)
	}
	return results
}

// MakeDefaultExtractFunc performs extracting operation for an extractor on model and returns true or false.
func MakeDefaultExtractFunc(data map[string]interface{}, extractor *extractors.Extractor) map[string]struct{} {
	part := extractor.Part
	if part == "" {
		part = "response"
	}

	item, ok := data[part]
	if !ok && !extractors.SupportsMap(extractor) {
		return nil
	}
	itemStr := types.ToString(item)

	switch extractor.GetType() {
	case extractors.RegexExtractor:
		return extractor.ExtractRegex(itemStr)
	case extractors.KValExtractor:
		return extractor.ExtractKval(data)
	case extractors.JSONExtractor:
		return extractor.ExtractJSON(itemStr)
	case extractors.XPathExtractor:
		return extractor.ExtractXPath(itemStr)
	case extractors.DSLExtractor:
		return extractor.ExtractDSL(data)
	}
	return nil
}

// MakeDefaultMatchFunc performs matching operation for a matcher on model and returns true or false.
func MakeDefaultMatchFunc(data map[string]interface{}, matcher *matchers.Matcher) (bool, []string) {
	part := matcher.Part
	if part == "" {
		part = "response"
	}

	partItem, ok := data[part]
	if !ok && matcher.Type.MatcherType != matchers.DSLMatcher {
		return false, nil
	}
	item := types.ToString(partItem)

	switch matcher.GetType() {
	case matchers.SizeMatcher:
		result := matcher.Result(matcher.MatchSize(len(item)))
		return result, nil
	case matchers.WordsMatcher:
		return matcher.ResultWithMatchedSnippet(matcher.MatchWords(item, nil))
	case matchers.RegexMatcher:
		return matcher.ResultWithMatchedSnippet(matcher.MatchRegex(item))
	case matchers.BinaryMatcher:
		return matcher.ResultWithMatchedSnippet(matcher.MatchBinary(item))
	case matchers.DSLMatcher:
		return matcher.Result(matcher.MatchDSL(data)), nil
	}
	return false, nil
}
