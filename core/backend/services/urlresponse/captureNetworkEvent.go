package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

var reqList = []string{}
var respList = []string{}

type Request struct {
	URL     string            `json:"url"`
	Method  string            `json:"method"`
	Headers map[string]string `json:"headers"`
}

type Response struct {
	URL     string            `json:"url"`
	Status  int               `json:"status"`
	Headers map[string]string `json:"headers"`
}

type Combined struct {
	Request  Request  `json:"request"`
	Response Response `json:"response"`
}

func Run(url string) (string, bool) {
	GetPageResource(url)

	combinedList, err := combineRequestResponse(reqList, respList)
	if err != nil {
		fmt.Println("Error combining request and response:", err)
		return err.Error(), false
	}

	// fmt.Println(reflect.TypeOf(result[0]))
	outout := strings.Join(combinedList, ",")
	outout = "[" + outout + "]"
	return outout, true
}

func combineRequestResponse(reqList []string, respList []string) ([]string, error) {
	reqMap := make(map[string]Request)
	respMap := make(map[string]Response)
	var combinedList []string

	// Deserialize requests and map them by URL
	for _, reqStr := range reqList {
		var req Request
		err := json.Unmarshal([]byte(reqStr), &req)
		if err != nil {
			return nil, err
		}
		reqMap[req.URL] = req
	}

	// Deserialize responses and map them by URL
	for _, respStr := range respList {
		var resp Response
		err := json.Unmarshal([]byte(respStr), &resp)
		if err != nil {
			return nil, err
		}
		respMap[resp.URL] = resp
	}

	// Combine requests and responses based on their URL
	for url, req := range reqMap {
		if resp, exists := respMap[url]; exists {
			combined := Combined{
				Request:  req,
				Response: resp,
			}
			combinedStr, err := json.Marshal(combined)
			if err != nil {
				return nil, err
			}
			combinedList = append(combinedList, string(combinedStr))
		}
	}

	return combinedList, nil
}

func GetPageResource(urlstr string) {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.NoDefaultBrowserCheck, //不检查默认浏览器
		chromedp.DisableGPU,
		chromedp.Flag("window-size", "50,400"),
		chromedp.Flag("headless", false),                 //开启图像界面,重点是开启这个
		chromedp.Flag("ignore-certificate-errors", true), //忽略错误
		chromedp.Flag("disable-web-security", true),      //禁用网络安全标志
		chromedp.NoFirstRun,                              //设置网站不是首次运行
		chromedp.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36"), //设置UserAgent
	)
	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	// create chrome instance
	ctx, cancel := chromedp.NewContext(
		allocCtx,
		// chromedp.WithDebugf(log.Printf),
	)
	defer cancel()

	// create a timeout
	ctx, cancel = context.WithTimeout(ctx, 4*time.Second)
	defer cancel()

	// ensure that the browser process is started
	if err := chromedp.Run(ctx); err != nil {
		panic(err)
	}

	// listen network event
	listenUrlForNetworkEvent(ctx)

	chromedp.Run(ctx,
		network.Enable(),
		chromedp.Navigate(urlstr),
		chromedp.WaitVisible(`body`, chromedp.BySearch),
	)
}

func listenUrlForNetworkEvent(ctx context.Context) {
	chromedp.ListenTarget(ctx, func(ev interface{}) {
		switch ev := ev.(type) {

		case *network.EventRequestWillBeSent:
			req := ev.Request
			if len(req.Headers) != 0 {
				b, _ := json.Marshal(req)
				reqList = append(reqList, string(b))
			}
		case *network.EventResponseReceived:
			resp := ev.Response
			if len(resp.Headers) != 0 {
				b, _ := json.Marshal(resp)
				respList = append(respList, string(b))
			}
		}
	})
}
