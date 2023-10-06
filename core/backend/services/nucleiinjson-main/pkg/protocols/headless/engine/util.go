package engine

import (
	"github.com/valyala/fasttemplate"
	"github.com/wen0750/nucleiinjson/pkg/protocols/common/marker"
)

func replaceWithValues(data string, values map[string]interface{}) string {
	return fasttemplate.ExecuteStringStd(data, marker.ParenthesisOpen, marker.ParenthesisClose, values)
}
