import { Request, Response, NextFunction } from "express";
export interface MiddlewareHandler {
  handler: (req: Request, res: Response, next: NextFunction) => any;
}
