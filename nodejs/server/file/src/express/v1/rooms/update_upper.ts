import * as Express from 'express';

import { update_upper as logic } from 'src/logic/rooms/update_upper';
import { info } from 'src/logic/rooms/info';

import { constant } from 'src/constant';
import { i_custom_requst } from 'src/interface';
import { io } from 'src/express/v1';

interface i_requst extends i_custom_requst {
  body: {
    upper: number;
  };
}

export const update_upper = async (req: i_requst, res: Express.Response) => {
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
      upper: Number(req.body.upper),
    });

    if (_ret) {
      // ブロードキャスト
      io.to(req.query.roomId).emit(
        constant.BROADCAST,
        await info(req.query.roomId)
      );
    }

    res.send({
      [constant.STATUS]: req.query.status,
    });
  } catch (e) {
    res.sendStatus(500);
  }
};
