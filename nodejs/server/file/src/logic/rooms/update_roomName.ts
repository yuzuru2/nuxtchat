import { find_info_rooms } from 'src/mongoose/model/rooms';
import { create, delete_transactions } from 'src/mongoose/model/transactions';
import { update_rooms } from 'src/mongoose/model/rooms';
import { create as create_talks } from 'src/mongoose/model/talks';

import * as mongoose from 'mongoose';

export const update_room_name = async (params: {
  roomId: string;
  id: string;
  roomName: string;
}) => {
  const session = await mongoose.startSession();
  try {
    // ホストか
    const _list = await find_info_rooms({ roomId: params.roomId });
    if (_list.length === 0 || _list[0].hostId !== params.id) {
      return false;
    }

    // 部屋名が変わってるか
    if (params.roomName === _list[0].roomName) {
      throw new Error('部屋名が変わってない');
    }

    // トランザクション開始
    session.startTransaction();

    // ロック
    await create(params.roomId, session);

    // update
    await update_rooms({ name: params.roomName }, { roomId: params.roomId });

    // メッセージ
    await create_talks(
      {
        roomId: params.roomId,
        roomName: _list[0].roomName,
        userId: null,
        userName: '',
        iconId: 0,
        ip: '0.0.0.0',
        kind: 0,
        message: `部屋名が「${params.roomName}」に変更されました`,
      },
      session
    );

    // 行ロック解除
    await delete_transactions(params.roomId, session);

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
