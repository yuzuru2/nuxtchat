// npm i --save node-cron
process.env.TZ = 'Asia/Tokyo';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import * as http from 'http';
import * as socketio from 'socket.io';
import * as redis from 'socket.io-redis';
import * as fs from 'fs';
import * as cron from 'node-cron';

import { find_exit_room_user } from 'src/mongoose/model/users';
import { exit_room } from 'src/logic/rooms/exit_room';

import { constant } from 'src/constant';
import { delete_file } from 'src/firebase/storage';

/**
 * httpサーバ起動
 */
const io = socketio(http.createServer());

/**
 * socket.io-redis設定
 */
io.adapter(
  redis(
    JSON.parse(
      fs.readFileSync(`${process.cwd()}/config/database.json`, 'utf-8')
    )['redis'][process.env.NODE_ENV]
  )
);

const regular = () => {
  /**
   * cron
   * 5分ごとに実行
   * 自動退室
   */
  cron.schedule('*/5 * * * *', async () => {
    const _list = await find_exit_room_user();
    for (let row of _list) {
      const _ret = await exit_room({ id: row.id, roomId: row.roomId });
      if (_ret.result) {
        // ブロードキャスト
        io.to(row.roomId).emit(constant.BROADCAST, {});
        io.to(row.roomId).emit(constant.EXILE, { id: row.id });
      }

      // 画像削除
      if (_ret.delete_flag) {
        for (let filename of _ret.images) {
          await delete_file(filename);
        }
      }
    }
  });
};

regular();
