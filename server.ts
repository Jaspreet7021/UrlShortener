import { router } from "./controller"

const http = require("http")
const PORT = 4000 

const reqListener = (req:any,res:any)=>{
  //console.log("Hello World")
  router(req,res)
}
const server = http.createServer(reqListener)
server.listen(PORT,()=>{
  console.log(`Server is running on port - ${PORT}`)
})