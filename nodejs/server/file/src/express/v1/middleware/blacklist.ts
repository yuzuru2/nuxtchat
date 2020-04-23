import * as Express from 'express';

import { find } from 'src/mongoose/model/blacklists';
import { shaping_ip } from 'src/util';

export const blacklist = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const _ret = await find({ ip: shaping_ip(req.ip) });
  if (!_ret) {
    next();
    return;
  }

  res.sendStatus(505);
};
