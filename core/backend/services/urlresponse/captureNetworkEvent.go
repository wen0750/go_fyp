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

var resourceList = []string{}

func Capture() {
	result := GetPageResource("https://engoo.com.tw/app/materials/en https://engoo.com.tw/app/materials/en")

	outout := strings.Join(result, ",")
	outout = "[" + outout + "]"
	fmt.Println(outout)
}

func GetPageResource(urlstr string) []string {
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
	return resourceList
}

func listenUrlForNetworkEvent(ctx context.Context) {
	chromedp.ListenTarget(ctx, func(ev interface{}) {
		switch ev := ev.(type) {

		case *network.EventResponseReceived:
			resp := ev.Response
			if len(resp.Headers) != 0 {
				b, _ := json.Marshal(resp)

				resourceList = append(resourceList, string(b))
			}
		}
	})
}
