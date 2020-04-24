/**
 * コアモジュール
 */
import * as redis from 'socket.io-redis';
import * as fs from 'fs';

/**
 * ミドルウエア
 */
import { user } from 'src/socketio/v1/middleware/user';
import { room } from 'src/socketio/v1/middleware/room';
import { kidoku } from 'src/socketio/v1/middleware/kidoku';

import { i_socket_params } from 'src/interface';
import { constant } from 'src/constant';
import { io } from 'src/express/v1';

import { info } from 'src/logic/rooms/info';
import { create as create_kidoku } from 'src/mongoose/model/kidokus';
import { find as find_talks } from 'src/mongoose/model/talks';
import { update_updatedAt } from 'src/mongoose/model/users';

export const v1 = async () => {
  //socket.io-redis設定
  io.adapter(
    redis(
      JSON.parse(
        fs.readFileSync(`${process.cwd()}/config/database.json`, 'utf-8')
      )['redis'][process.env.NODE_ENV]
    )
  );

  // origin
  if (process.env.NODE_ENV === 'production') {
    io.set('origins', constant.ORIGIN[process.env.NODE_ENV] + ':443');
  }

  // タイムアウトを5秒に設定する
  io.set('heartbeat timeout', 5000);
  io.set('heartbeat interval', 5000);

  // ミドルウエア
  io.use(user);

  // roomに入る
  io.use(room);

  // 既読つける
  io.use(kidoku);

  // connection
  io.on('connection', async (socket: i_socket_params) => {
    socket.on(constant.TALK_INFO, async () => {
      // 既読をつける
      const _list = await find_talks({ roomId: socket.ROOMID });
      await create_kidoku(
        _list.map((m) => {
          return {
            roomId: socket.ROOMID,
            talkId: m.talkId,
            userId: m.userId,
          };
        }),
        { userId: socket.ID }
      );

      await update_updatedAt(socket.ID, socket.IP);

      io.to(socket.ROOMID).emit(constant.TALK_INFO, await info(socket.ROOMID));
    });

    io.to(socket.ROOMID).emit(constant.BROADCAST, {});

    // 切断
    socket.on('disconnect', () => {});
  });
};
