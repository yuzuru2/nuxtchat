import * as Express from 'express';

import { find_info_rooms } from 'src/mongoose/model/rooms';

import { constant } from 'src/constant';
import { i_custom_requst } from 'src/interface';

export const list = async (req: i_custom_requst, res: Express.Response) => {
  try {
    if (req.query.status !== '1') {
      res.send({
        [constant.STATUS]: req.query.status,
      });
      return;
    }

    res.send({
      [constant.STATUS]: '1',
      room_list: await find_info_rooms(),
    });
  } catch (e) {
    res.sendStatus(500);
  }
};
