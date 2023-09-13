import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
    const code = "id: \n\ninfo: \n\tname: \n\tauthor: \n\tseverity: \n\tdescription: \n\treference: \n\tclassification: \n\t\tcvss-metrics: \n\t\tcvss-score: \n\t\tcwe-id: \n\ttags: \n\tmetadata: \n\t\tmax-request: \n\ndns: \n\tname: \n\ttype: \n\n\tmatchers-condition: \n\tmatchers: \n\t\ttype: \n\t\twords:";
    
    return (
        <AceEditor            
            value={code}
            height="500px"
            width="100%"
            theme="monokai"
            mode="yaml"
            highlightActiveLine={true}
            setOptions={{
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 2,
                fontFamily: "JetBrains Mono",
                fontSize: "16px"
                  
            }}
        />
    );
}
export default App;