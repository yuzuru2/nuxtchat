/**
 * コアモジュール
 */
import * as Express from 'express';

import { update_roomId } from 'src/mongoose/model/users';
import { create } from 'src/mongoose/model/rooms';

import { constant } from 'src/constant';
import { i_custom_requst } from 'src/interface';

interface i_requst extends i_custom_requst {
  body: {
    name: string;
    upper: number;
  };
}

export const create_rooms = async (req: i_requst, res: Express.Response) => {
  try {
    if (req.query.status !== '1') {
      res.send({
        [constant.STATUS]: req.query.status,
      });
      return;
    }

    // 部屋作成
    const _ret = await create({
      name: String(req.body.name),
      upper: Number(req.body.upper),
      hostId: req.query.id,
    });

    // 入室
    await update_roomId({ id: req.query.id, roomId: _ret[0].roomId });

    res.send({
      [constant.STATUS]: '2',
    });
  } catch (e) {
    res.sendStatus(500);
  }
};
