import Input from "@mui/joy/Input";
const opts = {
    http_request_opts: {
        custom: [
            {
                label: "add Value",
                description:
                    "The Accept header defines the media types that the client is able to accept from the server. For instance, Accept: application/json, text/html indicates that the client prefers JSON or HTML responses. This information allows the server to send a resource representation that meets the client’s needs.",
                component: Input,
                enabled: false,
            },
            {
                label: "add Field & Value",
                description:
                    "The Accept header defines the media types that the client is able to accept from the server. For instance, Accept: application/json, text/html indicates that the client prefers JSON or HTML responses. This information allows the server to send a resource representation that meets the client’s needs.",
                component: Input,
                enabled: false,
            },
        ],
        common: [
            {
                label: "Accept",
                description:
                    "The Accept header defines the media types that the client is able to accept from the server. For instance, Accept: application/json, text/html indicates that the client prefers JSON or HTML responses. This information allows the server to send a resource representation that meets the client’s needs.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Accept-Charset",
                description:
                    "The Accept-Charset HTTP header specifies the character sets the client can understand. It helps the server determine the appropriate character set for the response.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Accept-Datetime",
                description:
                    "The Accept-Datetime HTTP header is used by a client to indicate a preferred date and time format. It allows the server to provide a response based on the client's specified date and time format, facilitating content retrieval or versioning based on specific timestamps.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Accept-Encoding",
                description:
                    "The Accept-Encoding HTTP header is used by a client to indicate the compression algorithms it supports. It allows the server to compress the response using the preferred algorithm, reducing data transfer size. Common values include gzip and deflate, enabling efficient data transmission between the client and server.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Accept-Language",
                description:
                    "The Accept-Language HTTP header is used by a client to indicate the preferred language for the response. It allows the server to tailor the content based on the client's language preference. The header value typically includes language codes like en for English or fr for French.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Authorization",
                description:
                    "The Authorization HTTP header is used to include credentials or tokens in a request to authenticate the client with the server. It is commonly used in authentication schemes like Basic or Bearer, allowing the server to verify the client's identity and grant access to protected resources.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Cache-Control",
                description:
                    "The Cache-Control header controls caching behavior in the client’s browser or intermediate caches. It defines how the response can be cached, when it expires, and how it should be revalidated. For example, Cache-Control: max-age=3600, public instructs the client to cache the response for a maximum of 3600 seconds (1 hour) and allows caching by public caches.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Connection",
                description:
                    "The Connection HTTP header is used to control the behavior of the connection between the client and server. It can indicate whether the connection should be kept alive for subsequent requests, closed after completing the current request, or upgraded to a different protocol, such as WebSocket.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Content-Length",
                description:
                    "The Content-Length HTTP header specifies the size of the entity body in the request or response message. It indicates the length of the content being sent or received in bytes. This allows the recipient to accurately read and process the message without unnecessary buffering or truncation.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Content-MD5",
                description:
                    "The Content-MD5 HTTP header provides a base64-encoded MD5 hash of the entity body in the request or response. It is used for integrity checking to ensure that the content has not been modified during transit. The recipient can compare the computed MD5 hash with the provided value for verification.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Content-Type",
                description:
                    "The Content-Type HTTP header specifies the media type or MIME type of the content in the request or response. It indicates how the content should be interpreted and processed. Common values include text/html for HTML documents, application/json for JSON data, and image/jpeg for JPEG images.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Cookie",
                description:
                    "The client can use the Cookie header to send previously stored cookies back to the server. The server then uses these cookies to associate the request with a specific user or session. This header plays an important role in delivering personalized experiences, as it enables the server to remember a user’s login state or language preference.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Date",
                description:
                    "The Date HTTP header indicates the date and time when the request was generated or the response was sent. It helps in synchronization, caching, and determining the freshness of the resource. The date format follows the HTTP-date format specified by RFC 7231.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Expect",
                description:
                    "The Expect HTTP header specifies certain expectations that the client has for the server's behavior. It is typically used to indicate whether the client expects the server to meet specific conditions before processing the request, such as validating the request with a certain precondition or performing specific actions.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Forwarded",
                description:
                    "The Forwarded HTTP header is used to indicate the chain of proxies or intermediaries through which the request has passed. It helps to track the client's original IP address, allowing servers to identify the client's location and handle requests accordingly, especially in the presence of multiple proxies or load balancers.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "From",
                description:
                    "The From HTTP header allows the client to provide the email address or contact information of the user or client making the request. It can be used for informational or logging purposes, enabling the server to identify the sender of the request or potentially contact them if necessary.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Host",
                description:
                    "The Host HTTP header specifies the domain name or IP address of the server the client is attempting to communicate with. It is required in HTTP/1.1 requests and allows the server to determine which website or resource is being requested when multiple domains are hosted on the same server.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "If-Match",
                description:
                    "The If-Match HTTP header is used in conditional requests to ensure that the requested resource matches a specific entity tag (ETag) value. It allows the client to check if the resource has been modified since a previous request and avoid overwriting changes made by other clients.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "If-Modified-Since",
                description:
                    "The If-Modified-Since HTTP header is used in conditional requests to check if a resource has been modified since a specific date and time. It allows the server to determine whether to send the full response or respond with a 304 Not Modified status code, indicating that the cached version can be used.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "If-None-Match",
                description:
                    "The If-None-Match HTTP header is used in conditional requests to check if a resource has not been modified since a specific entity tag (ETag) value. It allows the server to determine whether to send the full response or respond with a 304 Not Modified status code, indicating that the cached version can be used.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "If-Range",
                description:
                    "The If-Range HTTP header is used in conditional requests to specify a range of a resource that the client already has. It allows the server to determine whether to send the full response or a partial response based on the range specified and the current state of the resource.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "If-Unmodified-Since",
                description:
                    "The If-Unmodified-Since HTTP header is used in conditional requests to check if a resource has not been modified since a specific date and time. It allows the server to determine whether to process the request or respond with a 412 Precondition Failed status code if the resource has been modified.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Max-Forwards",
                description:
                    "The Max-Forwards HTTP header is used in tracing requests to limit the number of times a request can be forwarded by intermediaries. It helps prevent infinite request loops by specifying the maximum number of times the request can be forwarded before it is stopped or rejected.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Origin",
                description:
                    "The Origin HTTP header indicates the origin of a cross-origin request, consisting of the scheme, host, and port. It is used in CORS (Cross-Origin Resource Sharing) to protect against unauthorized access and allows servers to determine if a request should be allowed based on the requesting origin.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Pragma",
                description:
                    "The Pragma HTTP header is used for backward compatibility with older HTTP/1.0 caches. It can include directives like no-cache to instruct caches not to serve cached responses and to always forward the request to the origin server for fresh content. However, it is generally superseded by the more widely supported Cache-Control header in HTTP/1.1.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Proxy-Authorization",
                description:
                    "The Proxy-Authorization HTTP header is used by a client to provide authentication credentials to a proxy server. It allows the client to authenticate itself with the proxy server using the specified credentials, enabling access to restricted resources through the proxy.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Referer",
                description:
                    "The Referer HTTP header is used to indicate the URL of the referring page from which the current request originated. It allows servers to track the source of traffic and provide contextual information, often used for analytics or redirection purposes.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "Upgrade",
                description:
                    "The Upgrade HTTP header is used in a client request to indicate a desire to switch to a different protocol or version. It allows the client to request an upgrade from the current protocol, such as HTTP/1.1 to HTTP/2 or from HTTP to WebSocket, enabling more efficient communication or additional features.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
            {
                label: "User-Agent",
                description:
                    "The User-Agent HTTP header provides information about the client application or user agent making the request. It typically includes details such as the name, version, and operating system of the client, allowing the server to tailor the response or provide content suitable for the client's capabilities.",
                link: "https://mui.com/joy-ui/react-tooltip/",
                component: Input,
                enabled: false,
                value: "",
                issuer: "builtin",
            },
        ],
    },
    matchers_opts: [
        {
            label: "status",
            description:
                "A status code is a three-digit number included in an HTTP response that indicates the outcome of the server's processing of a request. It provides a standardized way to communicate the success, failure, or other conditions related to the request, helping clients understand and handle the response appropriately.",
            valueOption: [
                {
                    code: 100,
                    label: "Continue",
                    description: "The server has received the request headers and the client should proceed to send the request body.",
                },
                {
                    code: 101,
                    label: "Switching Protocols",
                    description: "The server is changing protocols according to the client's request.",
                },
                { code: 200, label: "OK", description: "The request was successful." },
                {
                    code: 201,
                    label: "Created",
                    description: "The request has been fulfilled, and a new resource is created.",
                },
                {
                    code: 204,
                    label: "No Content",
                    description: "The server successfully processed the request, but there is no content to return.",
                },
                {
                    code: 301,
                    label: "Moved Permanently",
                    description: "The requested resource has been permanently moved to a new location.",
                },
                {
                    code: 302,
                    label: "Found",
                    description: "The requested resource temporarily resides under a different URL.",
                },
                {
                    code: 304,
                    label: "Not Modified",
                    description: "Indicates that the resource has not been modified since the last request.",
                },
                {
                    code: 400,
                    label: "Bad Request",
                    description: "The server cannot process the request due to a client error.",
                },
                { code: 401, label: "Unauthorized", description: "The request requires user authentication." },
                {
                    code: 403,
                    label: "Forbidden",
                    description: "The server understood the request, but refuses to authorize it.",
                },
                {
                    code: 404,
                    label: "Not Found",
                    description: "The requested resource could not be found on the server.",
                },
                {
                    code: 500,
                    label: "Internal Server Error",
                    description: "A generic error message indicating that the server encountered an unexpected condition.",
                },
                {
                    code: 502,
                    label: "Bad Gateway",
                    description: "The server received an invalid response from an upstream server while processing the request.",
                },
                {
                    code: 503,
                    label: "Service Unavailable",
                    description: "The server is currently unable to handle the request due to temporary overloading or maintenance.",
                },
            ],
            condition: "or",
            conditionOptions: ["or"],
            isNegative: false,
            isInternal: false,
            enabled: false,
        },
        {
            label: "words",
            description: "Words contains word patterns required to be present in the response part.",
            valueOption: [],
            condition: "or",
            conditionOptions: ["and", "or"],
            part: "",
            isNegative: false,
            isInternal: false,
            enabled: false,
        },
        {
            label: "regex",
            description:
                "Regex contains Regular Expression patterns required to be present in the response part. \n\n Example \n # Match for Linkerd Service via Regex \n\n regex - (?mi)^Via\\s*?:.*?linkerd.*$ \n\n # Match for Open Redirect via Location header \n\n regex:- (?m)^(?:Location\\s*?:\\s*?)(?:https?://|//)?(?:[a-zA-Z0-9\\-_\\.@]*)example\\.com.*$",
            link: "https://docs.projectdiscovery.io/templates/reference/extractors#kval-extractor",
            valueOption: [],
            condition: "or",
            conditionOptions: ["and", "or"],
            part: "",
            isNegative: false,
            isInternal: false,
            enabled: false,
        },
        {
            label: "dsl",
            description:
                "Complex matchers of type dsl allows building more elaborate expressions with helper functions. These function allow access to Protocol Response which contains variety of data based on each protocol. See protocol specific documentation to learn about different returned results. \n\n Example: \n len(body)<1024 && status_code==200 \n#Body length less than 1024 and 200 status code \n\ncontains(toupper(body), md5(cookie)) \n# Check if the MD5 sum of cookies is contained in the uppercase body",
            valueOption: [],
            condition: "or",
            conditionOptions: ["and", "or"],
            part: "",
            isNegative: false,
            isInternal: false,
            enabled: false,
        },
        {
            label: "xpath",
            description: "XPath are the xpath queries expressions that will be evaluated against the response part.",
            valueOption: [],
            condition: "or",
            conditionOptions: ["and", "or"],
            part: "",
            isNegative: false,
            isInternal: false,
            enabled: false,
        },
        {
            label: "binary",
            description: "Binary are the binary patterns required to be present in the response part.",
            valueOption: [],
            condition: "or",
            conditionOptions: ["and", "or"],
            part: "",
            isNegative: false,
            isInternal: false,
            enabled: false,
        },
        {
            label: "size",
            description: "Size is the acceptable size for the response",
            valueOption: [],
            condition: "or",
            conditionOptions: ["and", "or"],
            part: "",
            isNegative: false,
            isInternal: false,
            enabled: false,
        },
    ],
    extractors_opts: [
        {
            label: "regex",
            description:
                "Regex contains Regular Expression patterns required to be present in the response part. \n\n Example \n # Match for Linkerd Service via Regex \n\n regex - (?mi)^Via\\s*?:.*?linkerd.*$ \n\n # Match for Open Redirect via Location header \n\n regex:- (?m)^(?:Location\\s*?:\\s*?)(?:https?://|//)?(?:[a-zA-Z0-9\\-_\\.@]*)example\\.com.*$",
            link: "https://docs.projectdiscovery.io/templates/reference/extractors#kval-extractor",
            valueOption: [],
            part: "",
            group: "",
            name: "",
            isInternal: false,
            enabled: false,
        },
        {
            label: "dsl",
            description:
                "Complex matchers of type dsl allows building more elaborate expressions with helper functions. These function allow access to Protocol Response which contains variety of data based on each protocol. See protocol specific documentation to learn about different returned results. \n\n Example: \n len(body)<1024 && status_code==200 \n#Body length less than 1024 and 200 status code \n\ncontains(toupper(body), md5(cookie)) \n# Check if the MD5 sum of cookies is contained in the uppercase body",
            link: "https://docs.projectdiscovery.io/templates/reference/extractors#kval-extractor",
            valueOption: [],
            part: "",
            group: "",
            name: "",
            isInternal: false,
            enabled: false,
        },
        {
            label: "xpath",
            description: "XPath are the xpath queries expressions that will be evaluated against the response part.",
            valueOption: [],
            part: "",
            group: "",
            name: "",
            attribute: "value",
            isInternal: false,
            enabled: false,
        },
        {
            label: "kval",
            description:
                "Extract key: value/key=value formatted data from Response Header/Cookie \n\n A kval extractor example to extract content-type header from HTTP Response. \n\n kval:content_type",
            link: "https://docs.projectdiscovery.io/templates/reference/extractors#kval-extractor",
            valueOption: [],
            part: "",
            group: "",
            name: "",
            isInternal: false,
            enabled: false,
        },
        {
            label: "json",
            description: "A json extractor example to extract value of id object from JSON block. \n\nExample: \njson:- '.[] | .id'",
            valueOption: [],
            part: "",
            group: "",
            name: "",
            isInternal: false,
            enabled: false,
        },
    ],

    matchersPart_opts: [
        {
            label: "template-id",
            description: "ID of the template executed",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "template-info",
            description: "Info Block of the template executed",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "template-path",
            description: "Path of the template executed",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "host",
            description: "Host is the input to the template",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "matched",
            description: "Matched is the input which was matched upon",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "type",
            description: "Type is the type of request made",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "request",
            description: "HTTP request made from the client",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "response",
            description: "HTTP response received from server",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "status_code",
            description: "Status Code received from the Server",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "body",
            description: "HTTP response body received from server (default)",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "content_length",
            description: "HTTP Response content length",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "header",
            description: "HTTP response headers",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "all_headers",
            description: "HTTP response headers",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "duration",
            description: "HTTP request time duration",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "all",
            description: "HTTP response body + headers",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "cookies_from_response",
            description: "HTTP response cookies in name:value format",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
        {
            label: "headers_from_response",
            description: "HTTP response headers in name:value format",
            descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
        },
    ],
};
export default opts;
