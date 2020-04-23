import * as Express from 'express';

import { i_custom_requst } from 'src/interface';
import { exit_room as logic } from 'src/logic/rooms/exit_room';
import { constant } from 'src/constant';

import { io } from 'src/express/v1';
import { delete_file } from 'src/firebase/storage';

export const exit_room = async (
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

    const _ret = await logic({
      id: req.query.id,
      roomId: req.query.roomId,
    });

    res.send({
      [constant.STATUS]: '1',
    });

    if (_ret.result) {
      // ブロードキャスト
      io.to(req.query.roomId).emit(constant.BROADCAST, {});
    }

    // 画像削除
    if (_ret.delete_flag) {
      for (let filename of _ret.images) {
        await delete_file(filename);
      }
    }
  } catch (err) {
    res.sendStatus(500);
  }
};
