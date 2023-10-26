// const phantom = require('phantom');
// var express = require('express');
import GetNetlog from "./src/component/netlog/netlog.js";
import express from "express";
import bodyParser from "body-parser"

var app = express();
var jsonParser = bodyParser.json()

app.post('/netsniff', jsonParser, function (req, res) {
    console.log(req.body);
    (async function () {
        const result = await GetNetlog(req.body.url)
        res.send(result);
    })();
})

app.listen(8001);