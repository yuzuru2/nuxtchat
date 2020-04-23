/**
 * コアモジュール
 */
import * as Express from 'express';
import * as _ from 'underscore';

import { room_black_lists_create as logic } from 'src/logic/room_blacklists/create';

import { constant } from 'src/constant';
import { i_custom_requst } from 'src/interface';
import { io } from 'src/express/v1';

interface i_requst extends i_custom_requst {
  body: {
    targetId: string;
  };
}

export const create = async (req: i_requst, res: Express.Response) => {
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
      targetId: String(req.body.targetId),
    });

    if (_ret) {
      // 追放
      io.to(req.query.roomId).emit(constant.EXILE, {
        id: String(req.body.targetId),
      });

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
