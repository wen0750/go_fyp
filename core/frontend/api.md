3 API:
Project(scan result) summary - default last scan:
    pid
    startTime
    endTime
    status
    result :[
        {
            template:{
                name: "",
                authors: [],
                tags: [],
                description: "",
                risk_level: int (1-5),
                metadata:{
                    cve,
                    cwe,   
                },
                remediation: "",
            }
            finding:{
                host: "",
                ip: "",
                port: int(1-65535),
                type: "http",
                matched: "",
                matchername: 
            }
        },
    ]


Project(scan result) summary - input HID:
    pid
    startTime
    endTime
    status
    result :[
        {
            template:{
                name: "",
                authors: [],
                tags: [],
                description: "",
                risk_level: int (1-5),
                metadata:{
                    cve,
                    cwe,   
                },
                remediation: "",
            }
            finding:{
                host: "",
                ip: "",
                port: int(1-65535),
                type: "http",
                matched: "",
                matchername: 
            }
        },
    ]
    
Scan History List:
    list all HID of a project
    scan start time
    scan finish time
    scan status



