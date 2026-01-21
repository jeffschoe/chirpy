import type { Request, Response } from "express";
import { config } from "../config.js";
import { reset } from "../db/queries/users.js";

export async function handlerReset(_req: Request, res: Response) {

  res.set("Content-Type", "text/plain; charset=utf-8");

  if (config.api.platform !== "dev") { //validate dev first before doing anything else
    res.status(403).send("Forbidden");
    return;
  }

  config.api.fileServerHits = 0;

  try {
      await reset();
  } catch (error) {
      throw new Error(`User reset unsuccessful, error: ${error}`)
  }
  
  res.send("Hits reset to 0");

  /**
   * //Could also have done:
   * res.write("Hits reset to 0");
   * res.end();
   */

}