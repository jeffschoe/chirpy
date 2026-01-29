import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { 
  middlewareHandleError,
  middlewareLogResponse, 
  middlewareMetricsInc 
} from "./api/middleware.js";
import { 
  handlerChirpsGet, 
  handlerChirpsCreate, 
  handlerChirpsRetrieve, 
  handlerChirpsDelete
} from "./api/chirps.js";
import { config } from "./config.js";
import { handlerUsersCreate, handlerUsersUpdate } from "./api/users.js";
import { handlerLogin, handlerRefresh, handlerRevoke } from "./api/auth.js";


const migrationClient = postgres(config.db.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

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

//admin
app.get('/admin/metrics', (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post('/admin/reset', (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next);
});

// auth
app.post('/api/login', (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});
app.post('/api/refresh', (req, res, next) => {
  Promise.resolve(handlerRefresh(req, res)).catch(next);
});
app.post('/api/revoke', (req, res, next) => {
  Promise.resolve(handlerRevoke(req, res)).catch(next);
});

//users
app.post('/api/users', (req, res, next) => {
  Promise.resolve(handlerUsersCreate(req, res)).catch(next);
});
app.put('/api/users', (req, res, next) => {
  Promise.resolve(handlerUsersUpdate(req, res)).catch(next);
});

//chirps
app.post('/api/chirps', (req, res, next) => {
  Promise.resolve(handlerChirpsCreate(req, res)).catch(next);
});
app.get('/api/chirps', (req, res, next) => {
  Promise.resolve(handlerChirpsRetrieve(req, res)).catch(next);
});
app.get('/api/chirps/:chirpId', (req, res, next) => {
  Promise.resolve(handlerChirpsGet(req, res)).catch(next);
});
app.delete('/api/chirps/:chirpId', (req, res, next) => {
  Promise.resolve(handlerChirpsDelete(req, res)).catch(next);
});


app.use(middlewareHandleError);
/**Error handling middleware needs to be defined last, 
 * after all your other app.use() and route handlers (app.post, app.get, etc.),
 * but before app.listen. 
 * */

app.listen(config.api.port, () => {
  console.log(`Server is runing at http://localhost:${config.api.port}`)
});



