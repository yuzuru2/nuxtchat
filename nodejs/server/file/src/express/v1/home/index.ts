import * as Express from 'express';

import { constant } from 'src/constant';
import { i_custom_requst } from 'src/interface';

export const home = async (req: i_custom_requst, res: Express.Response) => {
  try {
    res.send({
      [constant.STATUS]: req.query.status,
    });
  } catch (e) {
    res.sendStatus(500);
  }
};
