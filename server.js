"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = require("./controller");
var http = require("http");
var PORT = 4000;
var reqListener = function (req, res) {
    //console.log("Hello World")
    (0, controller_1.router)(req, res);
};
var server = http.createServer(reqListener);
server.listen(PORT, function () {
    console.log("Server is running on port - ".concat(PORT));
});
