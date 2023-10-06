package network

import (
	"encoding/hex"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/wen0750/nucleiinjson/pkg/model"
	"github.com/wen0750/nucleiinjson/pkg/model/types/severity"
	"github.com/wen0750/nucleiinjson/pkg/operators"
	"github.com/wen0750/nucleiinjson/pkg/operators/extractors"
	"github.com/wen0750/nucleiinjson/pkg/operators/matchers"
	"github.com/wen0750/nucleiinjson/pkg/output"
	"github.com/wen0750/nucleiinjson/pkg/protocols/common/contextargs"
	"github.com/wen0750/nucleiinjson/pkg/testutils"
)

func TestNetworkExecuteWithResults(t *testing.T) {
	options := testutils.DefaultOptions

	testutils.Init(options)
	templateID := "testing-network"
	request := &Request{
		ID:       templateID,
		Address:  []string{"{{Hostname}}:"},
		ReadSize: 2048,
		Inputs:   []*Input{},
		Operators: operators.Operators{
			Matchers: []*matchers.Matcher{{
				Name:  "test",
				Part:  "data",
				Type:  matchers.MatcherTypeHolder{MatcherType: matchers.WordsMatcher},
				Words: []string{"200 OK"},
			}},
			Extractors: []*extractors.Extractor{{
				Part:  "data",
				Type:  extractors.ExtractorTypeHolder{ExtractorType: extractors.RegexExtractor},
				Regex: []string{"<h1>.*</h1>"},
			}},
		},
	}
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(exampleBody))
	}))
	defer ts.Close()

	parsed, err := url.Parse(ts.URL)
	require.Nil(t, err, "could not parse url")
	request.Address[0] = "{{Hostname}}"

	request.Inputs = append(request.Inputs, &Input{Data: fmt.Sprintf("GET / HTTP/1.1\r\nHost: %s\r\n\r\n", parsed.Host)})
	executerOpts := testutils.NewMockExecuterOptions(options, &testutils.TemplateInfo{
		ID:   templateID,
		Info: model.Info{SeverityHolder: severity.Holder{Severity: severity.Low}, Name: "test"},
	})
	err = request.Compile(executerOpts)
	require.Nil(t, err, "could not compile network request")

	var finalEvent *output.InternalWrappedEvent
	t.Run("domain-valid", func(t *testing.T) {
		metadata := make(output.InternalEvent)
		previous := make(output.InternalEvent)
		ctxArgs := contextargs.NewWithInput(parsed.Host)
		err := request.ExecuteWithResults(ctxArgs, metadata, previous, func(event *output.InternalWrappedEvent) {
			finalEvent = event
		})
		require.Nil(t, err, "could not execute network request")
	})
	require.NotNil(t, finalEvent, "could not get event output from request")
	require.Equal(t, 1, len(finalEvent.Results), "could not get correct number of results")
	require.Equal(t, "test", finalEvent.Results[0].MatcherName, "could not get correct matcher name of results")
	require.Equal(t, 1, len(finalEvent.Results[0].ExtractedResults), "could not get correct number of extracted results")
	require.Equal(t, "<h1>Example Domain</h1>", finalEvent.Results[0].ExtractedResults[0], "could not get correct extracted results")
	finalEvent = nil

	t.Run("invalid-port-override", func(t *testing.T) {
		metadata := make(output.InternalEvent)
		previous := make(output.InternalEvent)
		ctxArgs := contextargs.NewWithInput("127.0.0.1:11211")
		err := request.ExecuteWithResults(ctxArgs, metadata, previous, func(event *output.InternalWrappedEvent) {
			finalEvent = event
		})
		require.Nil(t, err, "could not execute network request")
	})
	require.Nil(t, finalEvent.Results, "could not get event output from request")

	request.Inputs[0].Type = NetworkInputTypeHolder{NetworkInputType: hexType}
	request.Inputs[0].Data = hex.EncodeToString([]byte(fmt.Sprintf("GET / HTTP/1.1\r\nHost: %s\r\n\r\n", parsed.Host)))

	t.Run("hex-to-string", func(t *testing.T) {
		metadata := make(output.InternalEvent)
		previous := make(output.InternalEvent)
		ctxArgs := contextargs.NewWithInput(parsed.Host)
		err := request.ExecuteWithResults(ctxArgs, metadata, previous, func(event *output.InternalWrappedEvent) {
			finalEvent = event
		})
		require.Nil(t, err, "could not execute network request")
	})
	require.NotNil(t, finalEvent, "could not get event output from request")
	require.Equal(t, 1, len(finalEvent.Results), "could not get correct number of results")
	require.Equal(t, "test", finalEvent.Results[0].MatcherName, "could not get correct matcher name of results")
	require.Equal(t, 1, len(finalEvent.Results[0].ExtractedResults), "could not get correct number of extracted results")
	require.Equal(t, "<h1>Example Domain</h1>", finalEvent.Results[0].ExtractedResults[0], "could not get correct extracted results")
}

var exampleBody = `<!doctype html>
<html>
<head>
    <title>Example Domain</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        
    }
    div {
        width: 600px;
        margin: 5em auto;
        padding: 2em;
        background-color: #fdfdff;
        border-radius: 0.5em;
        box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);
    }
    a:link, a:visited {
        color: #38488f;
        text-decoration: none;
    }
    @media (max-width: 700px) {
        div {
            margin: 0 auto;
            width: auto;
        }
    }
    </style>    
</head>

<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples in documents. You may use this
    domain in literature without prior coordination or asking for permission.</p>
    <p><a href="https://www.iana.org/domains/example">More information...</a></p>
</div>
</body>
</html>
`
