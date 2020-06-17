import {NextFunction, Request, Response} from "express";

export function SendResponseMiddleware(req:Request, resp:Response, next:NextFunction) {
  const result = resp.locals['$route'];

  if(typeof result !== 'undefined') {
    resp.status(result.statusCode || 200)
      .contentType(result.contentType || 'application/json')
      .send(result.body || result);
  }

  next();
}
