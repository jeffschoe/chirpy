import { Request, Response, NextFunction } from "express";


export async function middlewareLogResponse(
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