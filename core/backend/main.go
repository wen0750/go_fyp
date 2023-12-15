package main

import (
	"go_fyp/core/backend/services/router"
	"go_fyp/core/backend/services/tagWordlist"
)

func main() {
	tagWordlist.GetWordlist()
	router.Initialize()
}
