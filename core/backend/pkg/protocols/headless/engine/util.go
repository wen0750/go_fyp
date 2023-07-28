package engine

import (
	"github.com/valyala/fasttemplate"
	"go_fyp_test/core/backend/pkg/protocols/common/marker"
)

func replaceWithValues(data string, values map[string]interface{}) string {
	return fasttemplate.ExecuteStringStd(data, marker.ParenthesisOpen, marker.ParenthesisClose, values)
}
