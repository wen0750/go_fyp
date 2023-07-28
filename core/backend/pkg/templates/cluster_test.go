package templates

import (
	"testing"

	"github.com/stretchr/testify/require"
	"go_fyp_test/core/backend/pkg/protocols/dns"
	"go_fyp_test/core/backend/pkg/protocols/http"
)

func TestClusterTemplates(t *testing.T) {
	tests := []struct {
		name      string
		templates map[string]*Template
		expected  [][]*Template
	}{
		{
			name: "http-cluster-get",
			templates: map[string]*Template{
				"first.yaml":  {RequestsHTTP: []*http.Request{{Path: []string{"{{BaseURL}}"}}}},
				"second.yaml": {RequestsHTTP: []*http.Request{{Path: []string{"{{BaseURL}}"}}}},
			},
			expected: [][]*Template{{
				{RequestsHTTP: []*http.Request{{Path: []string{"{{BaseURL}}"}}}},
				{RequestsHTTP: []*http.Request{{Path: []string{"{{BaseURL}}"}}}},
			}},
		},
		{
			name: "no-http-cluster",
			templates: map[string]*Template{
				"first.yaml":  {RequestsHTTP: []*http.Request{{Path: []string{"{{BaseURL}}/random"}}}},
				"second.yaml": {RequestsHTTP: []*http.Request{{Path: []string{"{{BaseURL}}/another"}}}},
			},
			expected: [][]*Template{
				{{RequestsHTTP: []*http.Request{{Path: []string{"{{BaseURL}}/random"}}}}},
				{{RequestsHTTP: []*http.Request{{Path: []string{"{{BaseURL}}/another"}}}}},
			},
		},
		{
			name: "dns-cluster",
			templates: map[string]*Template{
				"first.yaml":  {RequestsDNS: []*dns.Request{{Name: "{{Hostname}}"}}},
				"second.yaml": {RequestsDNS: []*dns.Request{{Name: "{{Hostname}}"}}},
			},
			expected: [][]*Template{{
				{RequestsDNS: []*dns.Request{{Name: "{{Hostname}}"}}},
				{RequestsDNS: []*dns.Request{{Name: "{{Hostname}}"}}},
			}},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			returned := Cluster(test.templates)
			require.ElementsMatch(t, returned, test.expected, "could not get cluster results")
		})
	}
}
