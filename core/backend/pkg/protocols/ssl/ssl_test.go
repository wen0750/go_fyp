package ssl

import (
	"testing"

	"github.com/stretchr/testify/require"

	"go_fyp_test/core/backend/pkg/model"
	"go_fyp_test/core/backend/pkg/model/types/severity"
	"go_fyp_test/core/backend/pkg/output"
	"go_fyp_test/core/backend/pkg/protocols/common/contextargs"
	"go_fyp_test/core/backend/pkg/testutils"
)

func TestSSLProtocol(t *testing.T) {
	options := testutils.DefaultOptions

	testutils.Init(options)
	templateID := "testing-ssl"
	request := &Request{
		Address: "{{Hostname}}",
	}
	executerOpts := testutils.NewMockExecuterOptions(options, &testutils.TemplateInfo{
		ID:   templateID,
		Info: model.Info{SeverityHolder: severity.Holder{Severity: severity.Low}, Name: "test"},
	})
	err := request.Compile(executerOpts)
	require.Nil(t, err, "could not compile ssl request")

	var gotEvent output.InternalEvent
	ctxArgs := contextargs.NewWithInput("google.com:443")
	err = request.ExecuteWithResults(ctxArgs, nil, nil, func(event *output.InternalWrappedEvent) {
		gotEvent = event.InternalEvent
	})
	require.Nil(t, err, "could not run ssl request")
	require.NotEmpty(t, gotEvent, "could not get event items")
}

func TestGetAddress(t *testing.T) {
	address, _ := getAddress("https://google.com")
	require.Equal(t, "google.com:443", address, "could not get correct address")
}
