import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { 
  middlewareHandleError,
  middlewareLogResponse, 
  middlewareMetricsInc 
} from "./api/middleware.js";
import { handlerChirpsValidate } from "./api/chirps.js";


const app = express();
const PORT = 8080;

app.use(middlewareLogResponse); 
//every incoming request goes through this middleware first.
//All httpe methods (get, post, etc) go through app.use

app.use(express.json()); // Built-in JSON body parsing middleware
app.use(
  "/app", 
  middlewareMetricsInc, 
  express.static("./src/app")
);
//app.use - allows you to mount middleware functions
//middleware are a series of functions that Express calls in order, like a chain, 
//when an HTTP request comes into your server
//we are using the express.static middleware, which serves static files
//arg to express.static is is the actual file system directory where those files live
//1st arg, `path`, is the path for which we will call the middleware function/s or,
//"middleware should only be executed when the URL path of the incoming request 
//starts with PATH"

app.get('/api/healthz', (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
/**
 * .get: - tells Express to listen for HTTP GET requests specifically
 * /healthz: This is the path (or route) that the handler will respond to. 
 * So when someone makes a GET request to http://localhost:8080/healthz, 
 * this handler will be triggered
 * handlerReadiness: This is the handler function that will execute when a 
 * GET request comes in to /healthz
 * Express automatically creates the req and res objects for us, 
 * they are not explicity passed
 * NOTE, Express still calls middlewareLogResponse first, then 
 * if/when next() is called, it calls handlerReadiness.
 */

app.get('/admin/metrics', (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});

app.post('/admin/reset', (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next);
});

app.post('/api/validate_chirp', (req, res, next) => {
  Promise.resolve(handlerChirpsValidate(req, res)).catch(next);
});

app.use(middlewareHandleError);
/**Error handling middleware needs to be defined last, 
 * after all your other app.use() and route handlers (app.post, app.get, etc.),
 * but before app.listen. 
 * */

app.listen(PORT, () => {
  console.log(`Server is runing at http://localhost:${PORT}`)
});



