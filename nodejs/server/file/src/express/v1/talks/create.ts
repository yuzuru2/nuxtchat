import * as Express from 'express';

import { create as talks_create } from 'src/logic/talks/create';
import { i_custom_requst } from 'src/interface';
import { shaping_ip } from 'src/util';
import { constant } from 'src/constant';
import { io } from 'src/express/v1';

import { delete_batch } from 'src/logic/other/delete_batch';

interface i_requst extends i_custom_requst {
  body: {
    message: string;
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

    const _ret = await talks_create({
      id: req.query.id,
      roomId: req.query.roomId,
      ip: shaping_ip(req),
      message: String(req.body.message),
    });

    if (_ret !== null) {
      // ブロードキャスト
      io.to(req.query.roomId).emit(constant.BROADCAST, {});
    }

    res.send({
      [constant.STATUS]: req.query.status,
    });
    
    await delete_batch(req.query.roomId);
  } catch (err) {
    res.sendStatus(500);
  }
};
