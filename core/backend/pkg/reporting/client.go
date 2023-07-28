package reporting

import (
	"go_fyp_test/core/backend/pkg/output"
)

// Client is a client for nuclei issue tracking module
type Client interface {
	RegisterTracker(tracker Tracker)
	RegisterExporter(exporter Exporter)
	Close()
	Clear()
	CreateIssue(event *output.ResultEvent) error
	GetReportingOptions() *Options
}
