import express from "express";

import { handlerReadiness } from "./api/readiness.js";

const app = express();
const PORT = 8080;

app.use("/app", express.static(`./src"/app"`));
//app.use - allows you to mount middleware functions
//middleware are a series of functions that Express calls in order, like a chain, 
//when an HTTP request comes into your server
//we are using the express.static middleware, which serves static files
//arg to express.statis is is the actual file system directory where those files live
//1st arg, `path`, is the path for which we will call the middleware function/s or,
//"middleware should only be executed when the URL path of the incoming request 
//starts with PATH"

app.get('/healthz', handlerReadiness)
/**
 * .get: - tells Express to listen for HTTP GET requests specifically
 * /healthz: This is the path (or route) that the handler will respond to. 
 * So when someone makes a GET request to http://localhost:8080/healthz, 
 * this handler will be triggered
 * handlerReadiness: This is the handler function that will execute when a 
 * GET request comes in to /healthz
 * Express automatically creates the req and res objects for us, 
 * they are not explicity passed
 */

app.listen(PORT, () => {
  console.log(`Server is runing at http://localhost:${PORT}`)
});