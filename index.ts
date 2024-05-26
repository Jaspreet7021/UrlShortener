import * as promptSync from 'prompt-sync'
import {writeMappedUrlToFile } from './controller'

const prompt = promptSync()
const urlToConvert = prompt("Enter the url to shorten :-")
var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
if(!pattern.test(urlToConvert))
{
    console.log("Please enter a proper Url")
}
else
{
    writeMappedUrlToFile(urlToConvert)
}