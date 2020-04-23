import * as Express from 'express';

export const middleware_error = (
  err: Error,
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  res.sendStatus(500);
};
