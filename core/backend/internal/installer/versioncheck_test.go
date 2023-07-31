package installer

import (
	"testing"

	"go_fyp_test/core/backend/pkg/catalog/config"

	"github.com/projectdiscovery/utils/generic"
	"github.com/stretchr/testify/require"
)

func TestVersionCheck(t *testing.T) {
	err := NucleiVersionCheck()
	require.Nil(t, err)
	cfg := config.DefaultConfig
	if generic.EqualsAny("", cfg.LatestNucleiIgnoreHash, cfg.LatestNucleiVersion, cfg.LatestNucleiTemplatesVersion) {
		// all above values cannot be empty
		t.Errorf("something went wrong got empty response nuclei-version=%v templates-version=%v ignore-hash=%v", cfg.LatestNucleiVersion, cfg.LatestNucleiTemplatesVersion, cfg.LatestNucleiIgnoreHash)
	}
}
