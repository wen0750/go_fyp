package main

import "go_fyp_test/core/backend/pkg/testutils"

// All Interactsh related testcases
var interactshTestCases = []TestCaseInfo{
	{Path: "http/interactsh.yaml", TestCase: &httpInteractshRequest{}, DisableOn: func() bool { return osutils.IsWindows() || osutils.IsOSX() }},
	{Path: "http/interactsh-stop-at-first-match.yaml", TestCase: &httpInteractshStopAtFirstMatchRequest{}, DisableOn: func() bool { return osutils.IsWindows() || osutils.IsOSX() }},
	{Path: "http/default-matcher-condition.yaml", TestCase: &httpDefaultMatcherCondition{}, DisableOn: func() bool { return osutils.IsWindows() || osutils.IsOSX() }},
}
