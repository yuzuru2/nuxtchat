process.env.TZ = 'Asia/Tokyo';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import * as mongoose from 'mongoose';

import { update_roomId, find_user } from 'src/mongoose/model/users';
import { create, delete_transactions } from 'src/mongoose/model/transactions';
import { find_info_rooms } from 'src/mongoose/model/rooms';
import { find } from 'src/mongoose/model/room_blacklists';
import { create as create_talks } from 'src/mongoose/model/talks';

export const entering_room = async (params: {
  id: string;
  roomId: string;
  ip: string;
}) => {
  const session = await mongoose.startSession();
  // トランザクション開始
  session.startTransaction();
  try {
    // 部屋ブラックリストか
    if (
      await find({ userId: params.id, roomId: params.roomId, ip: params.ip })
    ) {
      throw new Error('部屋ブラックリストがだから入室できない');
    }

    // 行ロック
    await create(params.id, session);

    // 人数見る
    const _list = await find_info_rooms({ roomId: params.roomId });
    if (_list.length === 0) {
      throw new Error('部屋がない');
    }

    if (_list.length >= _list[0].upper) {
      throw new Error('定員になっているから入室できない');
    }

    const _user = await find_user(params.id);

    if (
      _list.filter(
        (m) => m.iconId === _user[0].iconId && m.userName === _user[0].name
      ).length !== 0
    ) {
      throw new Error('同じアイコン・名前の人がいるから入室できない');
    }

    // 入室
    await update_roomId({ roomId: params.roomId, id: params.id }, session);

    // 入室しました
    await create_talks(
      {
        roomId: params.roomId,
        roomName: _list[0].roomName,
        userId: null,
        userName: '',
        iconId: 0,
        ip: '0.0.0.0',
        kind: 0,
        message: `${_user[0].name}さんが入室しました`,
      },
      session
    );

    // 行ロック解除
    await delete_transactions(params.id, session);

    // コミット
    await session.commitTransaction();
    // 切断
    session.endSession();

    return true;
  } catch (err) {
    // ロールバック
    await session.abortTransaction();

    // 切断
    session.endSession();

    return false;
  }
};
