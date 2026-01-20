import type { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerReset(_req: Request, res: Response) {

  config.api.fileServerHits = 0;

  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("Hits reset to 0");

  /**
   * //Could also have done:
   * res.write("Hits reset to 0");
   * res.end();
   */

}