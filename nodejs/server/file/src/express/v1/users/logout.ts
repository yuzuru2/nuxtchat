import * as Express from 'express';

import { delete_user } from 'src/mongoose/model/users';

import { constant } from 'src/constant';
import { i_custom_requst } from 'src/interface';

export const logout = async (req: i_custom_requst, res: Express.Response) => {
  try {
    if (req.query.status === '1') {
      await delete_user(req.query.id);
      res.send({
        [constant.STATUS]: '0',
      });
      return;
    }

    res.send({
      [constant.STATUS]: req.query.status,
    });
  } catch (e) {
    res.sendStatus(500);
  }
};
