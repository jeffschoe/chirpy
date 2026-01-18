import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";


export function middlewareLogResponse(
  req: Request, 
  res: Response, 
  next: NextFunction) {
    res.on("finish", () => { 
      //.on method allows you to listen for "finish" events on the resp object
      //The 'finish' event is emitted after the stream.end() method has been 
      //called, and all data has been flushed to the underlying system.
      //So, when the response "finishes", the arrow function, the callback, runs

      const statusCode = res.statusCode;

      if (statusCode < 200 || statusCode >= 300) {
        console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
      }
    });

    next();
    /**
     * Calls next() to hand control to the next middleware or the route handler.
     * Without this, the request would hang because Express wouldn’t move forward.
    */
    
  }

export function middlewareMetricsInc(
  _req: Request, 
  _res: Response, 
  next: NextFunction) {
    config.fileServerHits++;
    next();
}


export function middlewareHandleError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let statusCode = 500;
  let message = "Something went wrong on our end";

  console.log(err.message);

  respondWithError(res, statusCode, message);
}
  