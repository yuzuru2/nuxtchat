import { find_info_rooms } from 'src/mongoose/model/rooms';
import { create, delete_transactions } from 'src/mongoose/model/transactions';
import { update_roomId, find_user } from 'src/mongoose/model/users';
import { create as room_blacklists } from 'src/mongoose/model/room_blacklists';
import { create as create_talks } from 'src/mongoose/model/talks';

import * as mongoose from 'mongoose';

export const room_black_lists_create = async (params: {
  roomId: string;
  id: string;
  targetId: string;
}) => {
  try {
    // ホストか
    const _list = await find_info_rooms({ roomId: params.roomId });
    if (_list.length === 0 || _list[0].hostId !== params.id) {
      return false;
    }

    const session = await mongoose.startSession();

    // トランザクション開始
    session.startTransaction();

    // ロック
    await create(params.roomId, session);
    await create(params.targetId, session);

    const _check = await find_info_rooms({ roomId: params.roomId });
    if (_check.length === 0 || _check[0].hostId !== params.id) {
      throw new Error('部屋にいないか権限がないので部屋名を変更できない');
    }

    const _target_user = _check.filter((m) => m.userId === params.targetId);

    if (_target_user.length === 0) {
      throw new Error('追放対象者が部屋にいない');
    }

    // 部屋から追い出す
    await update_roomId({ roomId: '', id: params.targetId }, session);

    const _user = await find_user(params.targetId);

    // ブラックリスト入り
    await room_blacklists(
      { roomId: params.roomId, userId: params.targetId, ip: _user[0].ip },
      session
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
        message: `${_target_user[0].userName}さんが追放されました`,
      },
      session
    );

    // 行ロック解除
    await delete_transactions(params.roomId, session);
    await delete_transactions(params.targetId, session);

    // コミット
    await session.commitTransaction();

    // 切断
    session.endSession();

    return true;
  } catch (err) {
    return false;
  }
};
