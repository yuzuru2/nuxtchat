import * as Express from 'express';

import { update_hostId as logic } from 'src/logic/rooms/update_hostId';

import { constant } from 'src/constant';
import { i_custom_requst } from 'src/interface';
import { io } from 'src/express/v1';

interface i_requst extends i_custom_requst {
  body: {
    hostId: string;
  };
}

export const update_hostId = async (req: i_requst, res: Express.Response) => {
  try {
    if (req.query.status !== '2') {
      res.send({
        [constant.STATUS]: req.query.status,
      });
      return;
    }

    const _ret = await logic({
      roomId: req.query.roomId,
      id: req.query.id,
      new_hostId: String(req.body.hostId),
    });

    if (_ret) {
      // ブロードキャスト
      io.to(req.query.roomId).emit(constant.BROADCAST, {});
    }

    res.send({
      [constant.STATUS]: req.query.status,
    });
  } catch (e) {
    res.sendStatus(500);
  }
};
