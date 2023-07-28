package network

import (
	"testing"

	"github.com/stretchr/testify/require"

	"go_fyp_test/core/backend/pkg/model"
	"go_fyp_test/core/backend/pkg/model/types/severity"
	"go_fyp_test/core/backend/pkg/operators"
	"go_fyp_test/core/backend/pkg/operators/extractors"
	"go_fyp_test/core/backend/pkg/operators/matchers"
	"go_fyp_test/core/backend/pkg/output"
	"go_fyp_test/core/backend/pkg/testutils"
)

func TestResponseToDSLMap(t *testing.T) {
	options := testutils.DefaultOptions

	testutils.Init(options)
	templateID := "testing-network"
	request := &Request{
		ID:       templateID,
		Address:  []string{"{{Hostname}}"},
		ReadSize: 1024,
		Inputs:   []*Input{{Data: "test-data\r\n"}},
	}
	executerOpts := testutils.NewMockExecuterOptions(options, &testutils.TemplateInfo{
		ID:   templateID,
		Info: model.Info{SeverityHolder: severity.Holder{Severity: severity.Low}, Name: "test"},
	})
	err := request.Compile(executerOpts)
	require.Nil(t, err, "could not compile network request")

	req := "test-data\r\n"
	resp := "resp-data\r\n"
	event := request.responseToDSLMap(req, resp, "test", "one.one.one.one", "one.one.one.one")
	require.Len(t, event, 9, "could not get correct number of items in dsl map")
	require.Equal(t, resp, event["data"], "could not get correct resp")
}

func TestNetworkOperatorMatch(t *testing.T) {
	options := testutils.DefaultOptions

	testutils.Init(options)
	templateID := "testing-network"
	request := &Request{
		ID:       templateID,
		Address:  []string{"{{Hostname}}"},
		ReadSize: 1024,
		Inputs:   []*Input{{Data: "test-data\r\n"}},
	}
	executerOpts := testutils.NewMockExecuterOptions(options, &testutils.TemplateInfo{
		ID:   templateID,
		Info: model.Info{SeverityHolder: severity.Holder{Severity: severity.Low}, Name: "test"},
	})
	err := request.Compile(executerOpts)
	require.Nil(t, err, "could not compile network request")

	req := "test-data\r\n"
	resp := "resp-data\r\nSTAT \r\n"
	event := request.responseToDSLMap(req, resp, "one.one.one.one", "one.one.one.one", "test")

	t.Run("valid", func(t *testing.T) {
		matcher := &matchers.Matcher{
			Part:  "body",
			Type:  matchers.MatcherTypeHolder{MatcherType: matchers.WordsMatcher},
			Words: []string{"STAT "},
		}
		err = matcher.CompileMatchers()
		require.Nil(t, err, "could not compile matcher")

		isMatched, matched := request.Match(event, matcher)
		require.True(t, isMatched, "could not match valid response")
		require.Equal(t, matcher.Words, matched)
	})

	t.Run("negative", func(t *testing.T) {
		matcher := &matchers.Matcher{
			Part:     "data",
			Type:     matchers.MatcherTypeHolder{MatcherType: matchers.WordsMatcher},
			Negative: true,
			Words:    []string{"random"},
		}
		err := matcher.CompileMatchers()
		require.Nil(t, err, "could not compile negative matcher")

		isMatched, matched := request.Match(event, matcher)
		require.True(t, isMatched, "could not match valid negative response matcher")
		require.Equal(t, []string{}, matched)
	})

	t.Run("invalid", func(t *testing.T) {
		matcher := &matchers.Matcher{
			Part:  "data",
			Type:  matchers.MatcherTypeHolder{MatcherType: matchers.WordsMatcher},
			Words: []string{"random"},
		}
		err := matcher.CompileMatchers()
		require.Nil(t, err, "could not compile matcher")

		isMatched, matched := request.Match(event, matcher)
		require.False(t, isMatched, "could match invalid response matcher")
		require.Equal(t, []string{}, matched)
	})

	t.Run("caseInsensitive", func(t *testing.T) {
		matcher := &matchers.Matcher{
			Part:            "body",
			Type:            matchers.MatcherTypeHolder{MatcherType: matchers.WordsMatcher},
			Words:           []string{"rESp-DAta"},
			CaseInsensitive: true,
		}
		err = matcher.CompileMatchers()
		require.Nil(t, err, "could not compile matcher")

		req := "TEST-DATA\r\n"
		resp := "RESP-DATA\r\nSTAT \r\n"
		event := request.responseToDSLMap(req, resp, "one.one.one.one", "one.one.one.one", "TEST")

		isMatched, matched := request.Match(event, matcher)
		require.True(t, isMatched, "could not match valid response")
		require.Equal(t, []string{"resp-data"}, matched)
	})
}

func TestNetworkOperatorExtract(t *testing.T) {
	options := testutils.DefaultOptions

	testutils.Init(options)
	templateID := "testing-network"
	request := &Request{
		ID:       templateID,
		Address:  []string{"{{Hostname}}"},
		ReadSize: 1024,
		Inputs:   []*Input{{Data: "test-data\r\n"}},
	}
	executerOpts := testutils.NewMockExecuterOptions(options, &testutils.TemplateInfo{
		ID:   templateID,
		Info: model.Info{SeverityHolder: severity.Holder{Severity: severity.Low}, Name: "test"},
	})
	err := request.Compile(executerOpts)
	require.Nil(t, err, "could not compile network request")

	req := "test-data\r\n"
	resp := "resp-data\r\nSTAT \r\n1.1.1.1\r\n"
	event := request.responseToDSLMap(req, resp, "one.one.one.one", "one.one.one.one", "test")

	t.Run("extract", func(t *testing.T) {
		extractor := &extractors.Extractor{
			Part:  "data",
			Type:  extractors.ExtractorTypeHolder{ExtractorType: extractors.RegexExtractor},
			Regex: []string{"[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+"},
		}
		err = extractor.CompileExtractors()
		require.Nil(t, err, "could not compile extractor")

		data := request.Extract(event, extractor)
		require.Greater(t, len(data), 0, "could not extractor valid response")
		require.Equal(t, map[string]struct{}{"1.1.1.1": {}}, data, "could not extract correct data")
	})

	t.Run("kval", func(t *testing.T) {
		extractor := &extractors.Extractor{
			Type: extractors.ExtractorTypeHolder{ExtractorType: extractors.KValExtractor},
			KVal: []string{"request"},
		}
		err = extractor.CompileExtractors()
		require.Nil(t, err, "could not compile kval extractor")

		data := request.Extract(event, extractor)
		require.Greater(t, len(data), 0, "could not extractor kval valid response")
		require.Equal(t, map[string]struct{}{req: {}}, data, "could not extract correct kval data")
	})
}

func TestNetworkMakeResult(t *testing.T) {
	options := testutils.DefaultOptions

	testutils.Init(options)
	templateID := "testing-network"
	request := &Request{
		ID:       templateID,
		Address:  []string{"{{Hostname}}"},
		ReadSize: 1024,
		Inputs:   []*Input{{Data: "test-data\r\n"}},
		Operators: operators.Operators{
			Matchers: []*matchers.Matcher{{
				Name:  "test",
				Part:  "data",
				Type:  matchers.MatcherTypeHolder{MatcherType: matchers.WordsMatcher},
				Words: []string{"STAT "},
			}},
			Extractors: []*extractors.Extractor{{
				Part:  "data",
				Type:  extractors.ExtractorTypeHolder{ExtractorType: extractors.RegexExtractor},
				Regex: []string{"[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+"},
			}},
		},
	}
	executerOpts := testutils.NewMockExecuterOptions(options, &testutils.TemplateInfo{
		ID:   templateID,
		Info: model.Info{SeverityHolder: severity.Holder{Severity: severity.Low}, Name: "test"},
	})
	err := request.Compile(executerOpts)
	require.Nil(t, err, "could not compile network request")

	req := "test-data\r\n"
	resp := "resp-data\rSTAT \r\n1.1.1.1\n"
	event := request.responseToDSLMap(req, resp, "one.one.one.one", "one.one.one.one", "test")
	finalEvent := &output.InternalWrappedEvent{InternalEvent: event}
	event["ip"] = "192.168.1.1"
	if request.CompiledOperators != nil {
		result, ok := request.CompiledOperators.Execute(event, request.Match, request.Extract, false)
		if ok && result != nil {
			finalEvent.OperatorsResult = result
			finalEvent.Results = request.MakeResultEvent(finalEvent)
		}
	}
	require.Equal(t, 1, len(finalEvent.Results), "could not get correct number of results")
	require.Equal(t, "test", finalEvent.Results[0].MatcherName, "could not get correct matcher name of results")
	require.Equal(t, "1.1.1.1", finalEvent.Results[0].ExtractedResults[0], "could not get correct extracted results")
}
