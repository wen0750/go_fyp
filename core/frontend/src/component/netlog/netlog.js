// const phantom = require('');
import phantom from 'phantom';

export default async function GetNetlog(url) {
    function createHAR(address, title, startTime, resources, html) {
        var entries = [];

        resources.forEach(function (resource) {
            var request = resource.request,
                startReply = resource.startReply,
                endReply = resource.endReply;

            if (!request || !startReply || !endReply) {
                return;
            }

            // Exclude Data URI from HAR file because
            // they aren't included in specification
            if (request.url.match(/(^data:image\/.*)/i)) {
                return;
            }

            entries.push({
                startedDateTime: request.time,
                time: endReply.time - request.time,
                request: {
                    method: request.method,
                    url: request.url,
                    httpVersion: "HTTP/1.1",
                    cookies: [],
                    headers: request.headers,
                    queryString: [],
                    headersSize: -1,
                    bodySize: -1
                },
                response: {
                    status: endReply.status,
                    statusText: endReply.statusText,
                    httpVersion: "HTTP/1.1",
                    cookies: [],
                    headers: endReply.headers,
                    redirectURL: "",
                    headersSize: -1,
                    bodySize: startReply.bodySize,
                    content: {
                        size: startReply.bodySize,
                        mimeType: endReply.contentType
                    }
                },
                cache: {},
                timings: {
                    blocked: 0,
                    dns: -1,
                    connect: -1,
                    send: 0,
                    wait: startReply.time - request.time,
                    receive: endReply.time - startReply.time,
                    ssl: -1
                },
                pageref: address
            });
        });

        return {
            pages: [{
                startedDateTime: startTime.toISOString(),
                id: address,
                title: title,
                pageTimings: {
                    onLoad: endTime - startTime
                }
            }],
            entries: entries,
            content: html
        };
    }

    const instance = await phantom.create();
    const page = await instance.createPage();
    var address = url;
    var resources = [];
    var startTime;

    page.setting('userAgent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36');

    await page.on('onLoadStarted', function () {
        startTime = new Date();
    });

    await page.on('onResourceRequested', function (req) {
        resources[req.id] = {
            request: req,
            startReply: null,
            endReply: null
        };
    });

    await page.on('onResourceReceived', function (res) {
        if (res.stage === 'start') {
            resources[res.id].startReply = res;
        }
        if (res.stage === 'end') {
            resources[res.id].endReply = res;
        }
    });

    const status = await page.open(address);
    var har, result;
    if (status !== 'success') {
        console.log('FAIL to load the address');
        return false
    } else {
        const content = await page.property('content');
        var endTime = new Date();
        var title = page.evaluate(function () {
            return document.title;
        });
        har = createHAR(address, title, startTime, resources, content);
    }

    result = JSON.stringify(har, undefined, 4);
    await instance.exit();
    return result
}