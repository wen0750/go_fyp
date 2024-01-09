package urlresponse

import (
	"context"
	"fmt"
	"time"

	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

var reqList = []network.Request{}
var respList = []network.Response{}
var respBody = ""

type NetowrkItem struct {
	URL               string                   `json:"url"`
	Method            string                   `json:"method"`
	Status            int64                    `json:"status"`
	ReferrerPolicy    string                   `json:"referrerPolicy"`
	RemoteIPAddress   string                   `json:"remoteIPAddress"`
	RemotePort        int64                    `json:"remotePort"`
	EncodedDataLength float64                  `json:"encodedDataLength"`
	ResponseTime      *cdp.TimeSinceEpochMilli `json:"responseTime"`
	SecurityState     string                   `json:"securityState"`
	ReqHeaders        map[string]interface{}   `json:"reqheaders"`
	RespHeaders       map[string]interface{}   `json:"respheaders"`
}

func Run(url string) ([]NetowrkItem, string, error) {
	reqList = []network.Request{}
	respList = []network.Response{}
	respBody = ""
	GetPageResource(url)
	return combineRequestResponse(reqList, respList)
}

func combineRequestResponse(reqList []network.Request, respList []network.Response) ([]NetowrkItem, string, error) {
	reqMap := make(map[string]network.Request)
	respMap := make(map[string]network.Response)
	combinedList := []NetowrkItem{}

	// Deserialize requests and map them by URL
	for _, reqItem := range reqList {
		reqMap[reqItem.URL] = reqItem
	}

	// Deserialize responses and map them by URL
	for _, respItem := range respList {
		respMap[respItem.URL] = respItem
	}

	// Combine requests and responses based on their URL
	for url, req := range reqMap {
		if resp, exists := respMap[url]; exists {
			combined := NetowrkItem{
				URL:               req.URL,
				Method:            req.Method,
				ReqHeaders:        req.Headers,
				Status:            resp.Status,
				RespHeaders:       resp.Headers,
				RemoteIPAddress:   resp.RemoteIPAddress,
				RemotePort:        resp.RemotePort,
				EncodedDataLength: resp.EncodedDataLength,
				ResponseTime:      resp.ResponseTime,
				SecurityState:     string(resp.SecurityState),
			}
			combinedList = append(combinedList, combined)
		}
	}

	return combinedList, respBody, nil
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
				reqList = append(reqList, *req)
			}
		case *network.EventResponseReceived:
			resp := ev.Response
			if len(resp.Headers) != 0 {
				respList = append(respList, *resp)
			}
		case *network.EventLoadingFinished:
			if respBody == "" {
				go func() {
					_ = chromedp.Run(ctx, chromedp.ActionFunc(func(ctx context.Context) error {
						htmlbody, err := network.GetResponseBody(ev.RequestID).Do(ctx)
						if err != nil {
							fmt.Println(err)
						} else {
							respBody = string(htmlbody)
						}
						return nil
					}))
				}()
			}
		}
	})
}
