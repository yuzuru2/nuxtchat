import * as Express from 'express';

import { constant } from 'src/constant';

export const authorization = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  req.headers.authorization === constant.AUTHORIZATION_KEY
    ? next()
    : res.sendStatus(403);
};
