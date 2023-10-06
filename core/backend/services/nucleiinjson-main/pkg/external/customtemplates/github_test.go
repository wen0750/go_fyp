package customtemplates

import (
	"context"
	"os"
	"path/filepath"
	"testing"

	"github.com/projectdiscovery/gologger"
	"github.com/stretchr/testify/require"
	"github.com/wen0750/nucleiinjson/pkg/catalog/config"
	"github.com/wen0750/nucleiinjson/pkg/testutils"
)

func TestDownloadCustomTemplatesFromGitHub(t *testing.T) {
	gologger.DefaultLogger.SetWriter(&testutils.NoopWriter{})

	templatesDirectory, err := os.MkdirTemp("", "template-custom-*")
	require.Nil(t, err, "could not create temp directory")
	defer os.RemoveAll(templatesDirectory)

	config.DefaultConfig.SetTemplatesDir(templatesDirectory)

	options := testutils.DefaultOptions
	options.GithubTemplateRepo = []string{"projectdiscovery/nuclei-templates", "ehsandeep/nuclei-templates"}
	options.GithubToken = os.Getenv("GITHUB_TOKEN")

	ctm, err := NewCustomTemplatesManager(options)
	require.Nil(t, err, "could not create custom templates manager")

	ctm.Download(context.Background())

	require.DirExists(t, filepath.Join(templatesDirectory, "github", "nuclei-templates-projectdiscovery"), "cloned directory does not exists")
	require.DirExists(t, filepath.Join(templatesDirectory, "github", "nuclei-templates-ehsandeep"), "cloned directory does not exists")
}
