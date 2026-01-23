import type { Request, Response } from "express";


export async function handlerReadiness(req: Request, res: Response) {
  /**
   * This function is responsible for:
   * Setting the appropriate headers
   * Sending back the response body.
   * Express automatically creates the req and res objects for us, 
   * they are not explicity passed.
   * The req object will contain details specific to that request 
   * (like the client's IP address, headers, body, etc.), 
   * and the res object is what you'll use to craft the response 
   * for that specific request. It starts off as empty, for us to fill up.
   */

  logRequest(req);

  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");

  logResponse(res);
}

function logRequest(req: Request) {
  console.log('==========Request Log==========')
  console.log(`* Request Method:      ${req.method}`);
  console.log(`* Request URL:         ${req.url}`);
  console.log(`* Request Headers:     ${JSON.stringify(req.headers)}`);
  console.log(`* Request Params:      ${JSON.stringify(req.params)}`);
  console.log(`* Request Query:       ${JSON.stringify(req.query)}`);
  console.log(`* Request Body:        ${req.body}`);
  console.log(`* Request IP:          ${req.ip}`);
  console.log(`* Request Status Code: ${req.statusCode}`);
}

function logResponse(res: Response) {
  console.log('==========Response Log==========')
  console.log(`* Response Headers Sent:    ${JSON.stringify(res.headersSent)}`)
  console.log(`* Response Locals:          ${JSON.stringify(res.locals)}`)
  console.log(`* Response Send Date:       ${JSON.stringify(res.sendDate)}`)
  console.log(`* Response Status Code:     ${JSON.stringify(res.statusCode)}`)
  console.log(`* Response Status Message:  ${JSON.stringify(res.statusMessage)}`)
}