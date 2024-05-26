import * as fs from 'fs'

const domainName = "http://localhost:4000/"
const filePath = "Replace this text with the path for your local txt file where you will be storing the data"
const postParam = "/testPost?urltoShorten="
var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

export function router(req,res){
    if(req.method === "GET")
    {
        let url = String(req.url)
        if(url.length>0)
        {
            url= url.slice(url.length-(url.length-1))
        }
        const path = filePath
        const fileData = readDataFromFile(path)
        const data = hasExistingData(fileData, url)
        const hasData = data[0]
        const dataUrl = data[2]
        if(hasData)
        {
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the data
            res.end(JSON.stringify(`response:${dataUrl}`));
        }
        else
        {
            res.writeHead(404, { "Content-Type": "application/json" });
            // send the data
            res.end(JSON.stringify("response:Data not present"));
        }
    }
    else if(req.url.toLocaleLowerCase().includes(postParam.toLocaleLowerCase()) && req.method === "POST")
    {
        console.log(req.url)
        const paramValue = String(req.url.slice(postParam.length)).trim()
        console.log(paramValue)
        if(paramValue.length>0 && paramValue!=="" && paramValue!==null && paramValue!==undefined )
        {
            if(!pattern.test(paramValue))
            {
                res.writeHead(400)
                res.end(JSON.stringify("Bad request. Provide url in correct format"))
                return;
                //console.log("Please enter a proper Url")
            }
            const response = writeMappedUrlToFile(paramValue)
            if(response[0])
            {
                res.writeHead(200)
                res.end(JSON.stringify(response[1]))
                return ;
            }
            else
            {
                res.writeHead(201)
                res.end(JSON.stringify(response[1]))
                return ;
            }
        }
        res.writeHead(400)
        res.end(JSON.stringify("Bad request. Provide url in correct format"))
        return;
    }
    else
    {
        res.writeHead(404)
        res.end(JSON.stringify("Not found"))
        return;
    }
}

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


export function getRandomAplhanumericString():string
{
    const strData = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    const dataLength = 7
    let response = ""
    for(let i =0;i<dataLength;i++)
    {
        response+=strData.charAt(Math.floor(Math.random()*strData.length))
    }
    return response
}

export function writeMappedUrlToFile(url:string):[boolean,string]
{
    try {
        const path = filePath
        console.log(path)
        if(fs.existsSync(path))
        {
            if(isSameDomain(url))
            {
                console.log(`Cannot shorten same domain url`)
                return [false,"Cannot shorten same domain url"]
            }
            const fileData = readDataFromFile(path)
            const data = hasExistingData(fileData,url)
            const hasExisting = data[0]
            const message = data[1]
            if(!hasExisting)
            {
                const randomAplhanumericString = getRandomAplhanumericString()
                const content = `${randomAplhanumericString}::${url}\n`
                fs.appendFile(path,content,(err)=>{
                    if(err)
                    {
                        console.log(`Error in upating file ${err}`)
                        throw err

                    }
                    console.log("Updated the file succesfully")
                })
                console.log(`${domainName}${randomAplhanumericString}`.trim())
                return[true, `${domainName}${randomAplhanumericString}`.trim()]
            }
            else
            {
                console.log(message)
                return[false, message]
            }
        }
        console.log("File path does not exists")
        return[false, "File path does not exists"]
    } catch (error) {
        console.log(error)
        return[false, error]
    }
}

 function readDataFromFile(path:string):string[]
 {
    let fileData:string[]
    try {
        fileData = fs.readFileSync(path,"utf-8").split('\n')
        return fileData   
    } catch (error) {
        console.log(`Error while file reading ${error}`)
    }
    return []
 }

 function hasExistingData(fileData:string[],url:string):[boolean,string,string]
 {
    try {
        if(fileData!==null && fileData.length>0)
        {
            for(let i =0 ;i<fileData.length;i++)
            {
                if(fileData[i]!=="" && fileData[i]!==null)
                {
                    const tempVal = fileData[i].split('::')
                    if(tempVal[0]===url)
                    {
                        return [true,`Url already exists, Value - ${tempVal[1]}`,tempVal[1]]
                    }
                    else if(tempVal[1]===url)
                    {
                        return [true,`Url already exists, Value - ${domainName}${tempVal[0]}`,tempVal[0]]
                    }
                }
            }
        }
        return [false,"",""]
    } catch (error) {
        console.log(`Method -hasExistingData, error - ${error} `)
    }
    return [false,"",""]
 }

 function isSameDomain(url:string):boolean
 {
    if(url.includes(domainName))
    {
        return true
    }
    return false    
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

