import { find_info_rooms } from 'src/mongoose/model/rooms';
import { create, delete_transactions } from 'src/mongoose/model/transactions';
import { update_rooms } from 'src/mongoose/model/rooms';
import { create as create_talks } from 'src/mongoose/model/talks';

import * as mongoose from 'mongoose';

export const update_hostId = async (params: {
  roomId: string;
  id: string;
  new_hostId: string;
}) => {
  const session = await mongoose.startSession();
  try {
    // ホストか
    const _list = await find_info_rooms({ roomId: params.roomId });
    if (_list.length === 0 || _list[0].hostId !== params.id) {
      return false;
    }

    // トランザクション開始
    session.startTransaction();

    // ロック
    await create(params.roomId, session);
    await create(params.new_hostId, session);

    const _check = await find_info_rooms({ roomId: params.roomId });
    const _new_host_user = _check.filter((m) => m.userId === params.new_hostId);

    if (_new_host_user.length === 0) {
      throw new Error('権限を渡す人が部屋にいない');
    }

    // update
    await update_rooms(
      { hostId: params.new_hostId },
      { roomId: params.roomId }
    );

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
        message: `${_new_host_user[0].userName}さんに権限が移譲されました`,
      },
      session
    );

    // 行ロック解除
    await delete_transactions(params.roomId, session);
    await delete_transactions(params.new_hostId, session);

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
