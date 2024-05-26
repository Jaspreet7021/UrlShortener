"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeMappedUrlToFile = exports.getRandomAplhanumericString = exports.router = void 0;
var fs = require("fs");
var domainName = "http://localhost:4000/";
var filePath = "Replace this text with the path for your local txt file where you will be storing the data";
var postParam = "/testPost?urltoShorten=";
var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
function router(req, res) {
    if (req.method === "GET") {
        var url = String(req.url);
        if (url.length > 0) {
            url = url.slice(url.length - (url.length - 1));
        }
        var path = filePath;
        var fileData = readDataFromFile(path);
        var data = hasExistingData(fileData, url);
        var hasData = data[0];
        var dataUrl = data[2];
        if (hasData) {
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the data
            res.end(JSON.stringify("response:".concat(dataUrl)));
        }
        else {
            res.writeHead(404, { "Content-Type": "application/json" });
            // send the data
            res.end(JSON.stringify("response:Data not present"));
        }
    }
    else if (req.url.toLocaleLowerCase().includes(postParam.toLocaleLowerCase()) && req.method === "POST") {
        console.log(req.url);
        var paramValue = String(req.url.slice(postParam.length)).trim();
        console.log(paramValue);
        if (paramValue.length > 0 && paramValue !== "" && paramValue !== null && paramValue !== undefined) {
            if (!pattern.test(paramValue)) {
                res.writeHead(400);
                res.end(JSON.stringify("Bad request. Provide url in correct format"));
                return;
                //console.log("Please enter a proper Url")
            }
            var response = writeMappedUrlToFile(paramValue);
            if (response[0]) {
                res.writeHead(200);
                res.end(JSON.stringify(response[1]));
                return;
            }
            else {
                res.writeHead(201);
                res.end(JSON.stringify(response[1]));
                return;
            }
        }
        res.writeHead(400);
        res.end(JSON.stringify("Bad request. Provide url in correct format"));
        return;
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify("Not found"));
        return;
    }
}
exports.router = router;
// function pageRedirection(url:string){
//     if(url!=="" && url!==null && url!==undefined)
//     {
//         //window.location.href = url
//         location.replace(url)
//     }
//     else{
//         // instead of google.com, we can replace it with a 404 not found page
//         window.location.href="www.google.com"
//     }
// }
function getRandomAplhanumericString() {
    var strData = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    var dataLength = 7;
    var response = "";
    for (var i = 0; i < dataLength; i++) {
        response += strData.charAt(Math.floor(Math.random() * strData.length));
    }
    return response;
}
exports.getRandomAplhanumericString = getRandomAplhanumericString;
function writeMappedUrlToFile(url) {
    try {
        var path = filePath;
        console.log(path);
        if (fs.existsSync(path)) {
            if (isSameDomain(url)) {
                console.log("Cannot shorten same domain url");
                return [false, "Cannot shorten same domain url"];
            }
            var fileData = readDataFromFile(path);
            var data = hasExistingData(fileData, url);
            var hasExisting = data[0];
            var message = data[1];
            if (!hasExisting) {
                var randomAplhanumericString = getRandomAplhanumericString();
                var content = "".concat(randomAplhanumericString, "::").concat(url, "\n");
                fs.appendFile(path, content, function (err) {
                    if (err) {
                        console.log("Error in upating file ".concat(err));
                        throw err;
                    }
                    console.log("Updated the file succesfully");
                });
                console.log("".concat(domainName).concat(randomAplhanumericString).trim());
                return [true, "".concat(domainName).concat(randomAplhanumericString).trim()];
            }
            else {
                console.log(message);
                return [false, message];
            }
        }
        console.log("File path does not exists");
        return [false, "File path does not exists"];
    }
    catch (error) {
        console.log(error);
        return [false, error];
    }
}
exports.writeMappedUrlToFile = writeMappedUrlToFile;
function readDataFromFile(path) {
    var fileData;
    try {
        fileData = fs.readFileSync(path, "utf-8").split('\n');
        return fileData;
    }
    catch (error) {
        console.log("Error while file reading ".concat(error));
    }
    return [];
}
function hasExistingData(fileData, url) {
    try {
        if (fileData !== null && fileData.length > 0) {
            for (var i = 0; i < fileData.length; i++) {
                if (fileData[i] !== "" && fileData[i] !== null) {
                    var tempVal = fileData[i].split('::');
                    if (tempVal[0] === url) {
                        return [true, "Url already exists, Value - ".concat(tempVal[1]), tempVal[1]];
                    }
                    else if (tempVal[1] === url) {
                        return [true, "Url already exists, Value - ".concat(domainName).concat(tempVal[0]), tempVal[0]];
                    }
                }
            }
        }
        return [false, "", ""];
    }
    catch (error) {
        console.log("Method -hasExistingData, error - ".concat(error, " "));
    }
    return [false, "", ""];
}
function isSameDomain(url) {
    if (url.includes(domainName)) {
        return true;
    }
    return false;
}
//  function checkForExistingKey(url:string):[boolean, string]
//  {
//     if(url.includes(domainName))
//     {
//         let urlValue = url.slice(domainName.length)
//         if(urlValue!=="" && urlValue!==null)
//         {
//             return[true,urlValue]
//         }
//         return[false,""]
//     }
//     return [false,""]    
//  }
