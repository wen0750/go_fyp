package engine

import (
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"go_fyp_test/core/backend/pkg/protocols/common/contextargs"
	"go_fyp_test/core/backend/pkg/protocols/common/protocolstate"
	"go_fyp_test/core/backend/pkg/testutils/testheadless"
	"go_fyp_test/core/backend/pkg/types"
)

func TestActionNavigate(t *testing.T) {
	response := `
		<html>
		<head>
			<title>Nuclei Test Page</title>
		</head>
		<body>
			<h1>Nuclei Test</h1>
		</body>
	</html>`

	actions := []*Action{{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}}, {ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}}}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "Nuclei Test Page", page.Page().MustInfo().Title, "could not navigate correctly")
	})
}

func TestActionScript(t *testing.T) {
	response := `
		<html>
		<head>
			<title>Nuclei Test Page</title>
		</head>
		<body>Nuclei Test Page</body>
		<script>window.test = 'some-data';</script>
	</html>`

	timeout := 180 * time.Second

	t.Run("run-and-results", func(t *testing.T) {
		actions := []*Action{
			{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
			{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
			{ActionType: ActionTypeHolder{ActionType: ActionScript}, Name: "test", Data: map[string]string{"code": "() => window.test"}},
		}

		testHeadlessSimpleResponse(t, response, actions, timeout, func(page *Page, err error, out map[string]string) {
			require.Nil(t, err, "could not run page actions")
			require.Equal(t, "Nuclei Test Page", page.Page().MustInfo().Title, "could not navigate correctly")
			require.Equal(t, "some-data", out["test"], "could not run js and get results correctly")
		})
	})

	t.Run("hook", func(t *testing.T) {
		actions := []*Action{
			{ActionType: ActionTypeHolder{ActionType: ActionScript}, Data: map[string]string{"code": "() => window.test = 'some-data';", "hook": "true"}},
			{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
			{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
			{ActionType: ActionTypeHolder{ActionType: ActionScript}, Name: "test", Data: map[string]string{"code": "() => window.test"}},
		}
		testHeadlessSimpleResponse(t, response, actions, timeout, func(page *Page, err error, out map[string]string) {
			require.Nil(t, err, "could not run page actions")
			require.Equal(t, "Nuclei Test Page", page.Page().MustInfo().Title, "could not navigate correctly")
			require.Equal(t, "some-data", out["test"], "could not run js and get results correctly with js hook")
		})
	})
}

func TestActionClick(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<body>Nuclei Test Page</body>
			<button onclick='this.setAttribute("a", "ok")'>click me</button>
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
		{ActionType: ActionTypeHolder{ActionType: ActionClick}, Data: map[string]string{"selector": "button"}}, // Use css selector for clicking
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "Nuclei Test Page", page.Page().MustInfo().Title, "could not navigate correctly")
		el := page.Page().MustElement("button")
		val := el.MustAttribute("a")
		require.Equal(t, "ok", *val, "could not click button")
	})
}

func TestActionRightClick(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<body>Nuclei Test Page</body>
			<button id="test" onrightclick=''>click me</button>
			<script>
				elm = document.getElementById("test");
				elm.onmousedown = function(event) {
					if (event.which == 3) {
						elm.setAttribute("a", "ok")
					}
				}
			</script>
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
		{ActionType: ActionTypeHolder{ActionType: ActionRightClick}, Data: map[string]string{"selector": "button"}}, // Use css selector for clicking
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "Nuclei Test Page", page.Page().MustInfo().Title, "could not navigate correctly")
		el := page.Page().MustElement("button")
		val := el.MustAttribute("a")
		require.Equal(t, "ok", *val, "could not click button")
	})
}

func TestActionTextInput(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<body>Nuclei Test Page</body>
			<input type="text" onchange="this.setAttribute('event', 'input-change')">
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
		{ActionType: ActionTypeHolder{ActionType: ActionTextInput}, Data: map[string]string{"selector": "input", "value": "test"}},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "Nuclei Test Page", page.Page().MustInfo().Title, "could not navigate correctly")
		el := page.Page().MustElement("input")
		val := el.MustAttribute("event")
		require.Equal(t, "input-change", *val, "could not get input change")
		require.Equal(t, "test", el.MustText(), "could not get input change value")
	})
}

func TestActionHeadersChange(t *testing.T) {
	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionSetHeader}, Data: map[string]string{"part": "request", "key": "Test", "value": "Hello"}},
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
	}

	handler := func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Test") == "Hello" {
			_, _ = fmt.Fprintln(w, `found`)
		}
	}

	testHeadless(t, actions, 20*time.Second, handler, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "found", strings.ToLower(strings.TrimSpace(page.Page().MustElement("html").MustText())), "could not set header correctly")
	})
}

func TestActionScreenshot(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<body>Nuclei Test Page</body>
		</html>`

	// filePath where screenshot is saved
	filePath := filepath.Join(os.TempDir(), "test.png")
	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
		{ActionType: ActionTypeHolder{ActionType: ActionScreenshot}, Data: map[string]string{"to": filePath}},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "Nuclei Test Page", page.Page().MustInfo().Title, "could not navigate correctly")
		_ = page.Page()
		require.FileExists(t, filePath, "could not find screenshot file %v", filePath)
		if err := os.RemoveAll(filePath); err != nil {
			t.Logf("got error %v while deleting temp file", err)
		}
	})
}

func TestActionScreenshotToDir(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<body>Nuclei Test Page</body>
		</html>`

	filePath := filepath.Join(os.TempDir(), "screenshot-"+strconv.Itoa(rand.Intn(1000)), "test.png")

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
		{ActionType: ActionTypeHolder{ActionType: ActionScreenshot}, Data: map[string]string{"to": filePath, "mkdir": "true"}},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "Nuclei Test Page", page.Page().MustInfo().Title, "could not navigate correctly")
		_ = page.Page()
		require.FileExists(t, filePath, "could not find screenshot file %v", filePath)
		if err := os.RemoveAll(filePath); err != nil {
			t.Logf("got error %v while deleting temp file", err)
		}
	})
}

func TestActionTimeInput(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<body>Nuclei Test Page</body>
			<input type="date">
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
		{ActionType: ActionTypeHolder{ActionType: ActionTimeInput}, Data: map[string]string{"selector": "input", "value": "2006-01-02T15:04:05Z"}},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "Nuclei Test Page", page.Page().MustInfo().Title, "could not navigate correctly")
		el := page.Page().MustElement("input")
		require.Equal(t, "2006-01-02", el.MustText(), "could not get input time value")
	})
}

func TestActionSelectInput(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<body>
				<select name="test" id="test">
				  <option value="test1">Test1</option>
				  <option value="test2">Test2</option>
				</select>
			</body>
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
		{ActionType: ActionTypeHolder{ActionType: ActionSelectInput}, Data: map[string]string{"by": "x", "xpath": "//select[@id='test']", "value": "Test2", "selected": "true"}},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		el := page.Page().MustElement("select")
		require.Equal(t, "Test2", el.MustText(), "could not get input change value")
	})
}

func TestActionFilesInput(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<body>Nuclei Test Page</body>
			<input type="file">
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
		{ActionType: ActionTypeHolder{ActionType: ActionFilesInput}, Data: map[string]string{"selector": "input", "value": "test1.pdf"}},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "Nuclei Test Page", page.Page().MustInfo().Title, "could not navigate correctly")
		el := page.Page().MustElement("input")
		require.Equal(t, "C:\\fakepath\\test1.pdf", el.MustText(), "could not get input file")
	})
}

func TestActionWaitLoad(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<button id="test">Wait for me!</button>
			<script>
				window.onload = () => document.querySelector('#test').style.color = 'red';
			</script>
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		el := page.Page().MustElement("button")
		style, attributeErr := el.Attribute("style")
		require.Nil(t, attributeErr)
		require.Equal(t, "color: red;", *style, "could not get color")
	})
}

func TestActionGetResource(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<body>
				<img id="test" src="https://nuclei.projectdiscovery.io/static/logo.png">
			</body>
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionGetResource}, Data: map[string]string{"by": "x", "xpath": "//img[@id='test']"}, Name: "src"},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, len(out["src"]), 3159, "could not find resource")
	})
}

func TestActionExtract(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<button id="test">Wait for me!</button>
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionExtract}, Data: map[string]string{"by": "x", "xpath": "//button[@id='test']"}, Name: "extract"},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "Wait for me!", out["extract"], "could not extract text")
	})
}

func TestActionSetMethod(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionSetMethod}, Data: map[string]string{"part": "x", "method": "SET"}},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "SET", page.rules[0].Args["method"], "could not find resource")
	})
}

func TestActionAddHeader(t *testing.T) {
	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionAddHeader}, Data: map[string]string{"part": "request", "key": "Test", "value": "Hello"}},
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
	}

	handler := func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Test") == "Hello" {
			_, _ = fmt.Fprintln(w, `found`)
		}
	}

	testHeadless(t, actions, 20*time.Second, handler, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "found", strings.ToLower(strings.TrimSpace(page.Page().MustElement("html").MustText())), "could not set header correctly")
	})
}

func TestActionDeleteHeader(t *testing.T) {
	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionAddHeader}, Data: map[string]string{"part": "request", "key": "Test1", "value": "Hello"}},
		{ActionType: ActionTypeHolder{ActionType: ActionAddHeader}, Data: map[string]string{"part": "request", "key": "Test2", "value": "World"}},
		{ActionType: ActionTypeHolder{ActionType: ActionDeleteHeader}, Data: map[string]string{"part": "request", "key": "Test2"}},
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
	}

	handler := func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Test1") == "Hello" && r.Header.Get("Test2") == "" {
			_, _ = fmt.Fprintln(w, `header deleted`)
		}
	}

	testHeadless(t, actions, 20*time.Second, handler, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "header deleted", strings.ToLower(strings.TrimSpace(page.Page().MustElement("html").MustText())), "could not delete header correctly")
	})
}

func TestActionSetBody(t *testing.T) {
	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionSetBody}, Data: map[string]string{"part": "request", "body": "hello"}},
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
	}

	handler := func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		_, _ = fmt.Fprintln(w, string(body))
	}

	testHeadless(t, actions, 20*time.Second, handler, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.Equal(t, "hello", strings.ToLower(strings.TrimSpace(page.Page().MustElement("html").MustText())), "could not set header correctly")
	})
}

func TestActionKeyboard(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<body>
				<input type="text" name="test" id="test">
			</body>
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitLoad}},
		{ActionType: ActionTypeHolder{ActionType: ActionClick}, Data: map[string]string{"selector": "input"}},
		{ActionType: ActionTypeHolder{ActionType: ActionKeyboard}, Data: map[string]string{"keys": "Test2"}},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		el := page.Page().MustElement("input")
		require.Equal(t, "Test2", el.MustText(), "could not get input change value")
	})
}

func TestActionSleep(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<button style="display:none" id="test">Wait for me!</button>
			<script>
				setTimeout(() => document.querySelector('#test').style.display = '', 1000);
			</script>
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionSleep}, Data: map[string]string{"duration": "2"}},
	}

	testHeadlessSimpleResponse(t, response, actions, 20*time.Second, func(page *Page, err error, out map[string]string) {
		require.Nil(t, err, "could not run page actions")
		require.True(t, page.Page().MustElement("button").MustVisible(), "could not get button")
	})
}

func TestActionWaitVisible(t *testing.T) {
	response := `
		<html>
			<head>
				<title>Nuclei Test Page</title>
			</head>
			<button style="display:none" id="test">Wait for me!</button>
			<script>
				setTimeout(() => document.querySelector('#test').style.display = '', 1000);
			</script>
		</html>`

	actions := []*Action{
		{ActionType: ActionTypeHolder{ActionType: ActionNavigate}, Data: map[string]string{"url": "{{BaseURL}}"}},
		{ActionType: ActionTypeHolder{ActionType: ActionWaitVisible}, Data: map[string]string{"by": "x", "xpath": "//button[@id='test']"}},
	}

	t.Run("wait for an element being visible", func(t *testing.T) {
		testHeadlessSimpleResponse(t, response, actions, 2*time.Second, func(page *Page, err error, out map[string]string) {
			require.Nil(t, err, "could not run page actions")

			page.Page().MustElement("button").MustVisible()
		})
	})

	t.Run("timeout because of element not visible", func(t *testing.T) {
		// increased timeout from time.Second/2 to time.Second due to random fails (probably due to overhead and system)
		testHeadlessSimpleResponse(t, response, actions, time.Second, func(page *Page, err error, out map[string]string) {
			require.Error(t, err)
			require.Contains(t, err.Error(), "Element did not appear in the given amount of time")
		})
	})
}

func testHeadlessSimpleResponse(t *testing.T, response string, actions []*Action, timeout time.Duration, assert func(page *Page, pageErr error, out map[string]string)) {
	t.Helper()
	testHeadless(t, actions, timeout, func(w http.ResponseWriter, r *http.Request) {
		_, _ = fmt.Fprintln(w, response)
	}, assert)
}

func testHeadless(t *testing.T, actions []*Action, timeout time.Duration, handler func(w http.ResponseWriter, r *http.Request), assert func(page *Page, pageErr error, extractedData map[string]string)) {
	t.Helper()
	_ = protocolstate.Init(&types.Options{})

	browser, err := New(&types.Options{ShowBrowser: false, UseInstalledChrome: testheadless.HeadlessLocal})
	require.Nil(t, err, "could not create browser")
	defer browser.Close()

	instance, err := browser.NewInstance()
	require.Nil(t, err, "could not create browser instance")
	defer instance.Close()

	ts := httptest.NewServer(http.HandlerFunc(handler))
	defer ts.Close()

	input := contextargs.NewWithInput(ts.URL)
	input.CookieJar, err = cookiejar.New(nil)
	require.Nil(t, err)

	extractedData, page, err := instance.Run(input, actions, nil, &Options{Timeout: timeout})
	assert(page, err, extractedData)

	if page != nil {
		page.Close()
	}
}

func TestContainsAnyModificationActionType(t *testing.T) {
	if containsAnyModificationActionType() {
		t.Error("Expected false, got true")
	}
	if containsAnyModificationActionType(ActionClick) {
		t.Error("Expected false, got true")
	}
	if !containsAnyModificationActionType(ActionSetMethod, ActionAddHeader, ActionExtract) {
		t.Error("Expected true, got false")
	}
	if !containsAnyModificationActionType(ActionSetMethod, ActionAddHeader, ActionSetHeader, ActionDeleteHeader, ActionSetBody) {
		t.Error("Expected true, got false")
	}
}
