import * as Express from 'express';

import { info } from 'src/logic/rooms/info';

import { constant } from 'src/constant';
import { i_custom_requst } from 'src/interface';

export const room_info = async (
  req: i_custom_requst,
  res: Express.Response
) => {
  try {
    if (req.query.status !== '2') {
      res.send({
        [constant.STATUS]: req.query.status,
      });
      return;
    }

    res.send({
      [constant.STATUS]: '2',
      userId: req.query.id,
      ...(await info(req.query.roomId)),
    });
  } catch (e) {
    res.sendStatus(500);
  }
};
