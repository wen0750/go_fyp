package main

import (
	"bytes"
	"encoding/json"
	"log"
	"os"
	"regexp"
	"strings"

	"github.com/alecthomas/jsonschema"

	"github.com/wen0750/nucleiinjson/pkg/templates"
)

var pathRegex = regexp.MustCompile(`github\.com/projectdiscovery/nuclei/v2/(?:internal|pkg)/(?:.*/)?([A-Za-z.]+)`)

func main() {
	// Generate yaml syntax documentation
	data, err := templates.GetTemplateDoc().Encode()
	if err != nil {
		log.Fatalf("Could not encode docs: %s\n", err)
	}

	if len(os.Args) < 3 {
		log.Fatalf("syntax: %s md-docs-file jsonschema-file\n", os.Args[0])
	}

	err = os.WriteFile(os.Args[1], data, 0644)
	if err != nil {
		log.Fatalf("Could not write docs: %s\n", err)
	}

	// Generate jsonschema
	r := &jsonschema.Reflector{
		PreferYAMLSchema:      true,
		YAMLEmbeddedStructs:   true,
		FullyQualifyTypeNames: true,
	}
	jsonschemaData := r.Reflect(&templates.Template{})

	var buf bytes.Buffer
	encoder := json.NewEncoder(&buf)
	encoder.SetIndent("", "  ")
	_ = encoder.Encode(jsonschemaData)

	schema := buf.String()
	for _, match := range pathRegex.FindAllStringSubmatch(schema, -1) {
		schema = strings.ReplaceAll(schema, match[0], match[1])
	}
	err = os.WriteFile(os.Args[2], []byte(schema), 0644)
	if err != nil {
		log.Fatalf("Could not write jsonschema: %s\n", err)
	}
}
