import * as Express from 'express';

import { file_create } from 'src/logic/talks/file_create';
import { i_custom_requst } from 'src/interface';
import { shaping_ip } from 'src/util';
import { constant } from 'src/constant';
import { io } from 'src/express/v1';

interface i_requst extends i_custom_requst {
  body: {
    image: Buffer;
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

    const _ret = await file_create({
      id: req.query.id,
      roomId: req.query.roomId,
      ip: shaping_ip(req),
      image: Buffer.from(req.body.image),
    });

    if (_ret !== null) {
      // ブロードキャスト
      io.to(req.query.roomId).emit(constant.BROADCAST, {});
    }

    res.send({
      [constant.STATUS]: req.query.status,
    });
  } catch (err) {
    res.sendStatus(500);
  }
};
