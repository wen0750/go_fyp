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
	URL            string     `json:"url"`
	Method         string     `json:"method"`
	RequestHeaders []struct{} `json:"headers"`
	ReferrerPolicy string     `json:"referrerPolicy"`
}

type Response struct {
	URL               string     `json:"url"`
	Status            string     `json:"status"`
	ResponseHeaders   []struct{} `json:"headers"`
	MimeType          string     `json:"mimeType"`
	RemoteIPAddress   string     `json:"remoteIPAddress"`
	RemotePort        string     `json:"remotePort"`
	EncodedDataLength string     `json:"encodedDataLength"`
	ResponseTime      string     `json:"responseTime"`
}

func main() {
	GetPageResource("https://engoo.com.tw/app/materials/en")
	// fmt.Println(reflect.TypeOf(result[0]))
	outout := strings.Join(reqList, ",")
	outout = "[" + outout + "]"
	fmt.Println(outout)

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
