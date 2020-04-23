import * as Express from 'express';

import { entering_room as logic } from 'src/logic/rooms/entering_room';

import { shaping_ip } from 'src/util';
import { constant } from 'src/constant';
import { i_custom_requst } from 'src/interface';
import { io } from 'src/express/v1';

interface i_requst extends i_custom_requst {
  body: {
    roomId: string;
  };
}

export const entering_room = async (req: i_requst, res: Express.Response) => {
  try {
    if (req.query.status !== '1') {
      res.send({
        [constant.STATUS]: req.query.status,
      });
      return;
    }

    if (
      await logic({
        id: req.query.id,
        roomId: String(req.body.roomId),
        ip: shaping_ip(req.ip),
      })
    ) {
      // ブロードキャスト
      io.to(req.body.roomId).emit(constant.BROADCAST, {});

      res.send({
        [constant.STATUS]: '2',
      });
      return;
    }
    res.send({
      [constant.STATUS]: '1',
    });
    return;
  } catch (e) {
    res.sendStatus(500);
  }
};
