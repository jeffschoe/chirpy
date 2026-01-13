/**
 * will hold any stateful, in-memory data we'll need to keep track of. 
 * In our case, we just need to keep track of the number of requests 
 * we've received.
 */

type APIConfig = {
  fileServerHits: number;
}

export const config: APIConfig = {
  fileServerHits: 0,
}