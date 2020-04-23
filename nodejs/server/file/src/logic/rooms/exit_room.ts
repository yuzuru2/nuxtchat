process.env.TZ = 'Asia/Tokyo';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import * as mongoose from 'mongoose';

import { update_roomId, find_user } from 'src/mongoose/model/users';
import { create, delete_transactions } from 'src/mongoose/model/transactions';
import {
  find_info_rooms,
  update_rooms,
  delete_room,
} from 'src/mongoose/model/rooms';
import {
  create as create_talks,
  find_kind1,
  delete_talks,
} from 'src/mongoose/model/talks';
import { delete_kidokus } from 'src/mongoose/model/kidokus';
import { delete_room_blacklists } from 'src/mongoose/model/room_blacklists';

export const exit_room = async (params: { id: string; roomId: string }) => {
  const session = await mongoose.startSession();
  // トランザクション開始
  session.startTransaction();
  try {
    // ルーム情報
    const _room_info = await find_info_rooms({ roomId: params.roomId });

    if (_room_info.length === 0) {
      throw new Error('部屋がない');
    }

    // 権限を渡す相手 ホスト以外はnull
    const _target =
      _room_info[0].hostId === params.id && _room_info.length >= 2
        ? _room_info.filter((m) => m.userId !== params.id)
        : null;

    // 行ロック
    await create(params.roomId, session);

    // 行ロック
    await create(params.id, session);

    // 行ロック
    if (_target !== null) {
      await create(_target[0].userId, session);
    }

    const _check = await find_info_rooms({ roomId: params.roomId });

    if (
      _target !== null &&
      _check.filter((m) => m.userId === _target[0].userId).length === 0
    ) {
      throw new Error('権限を渡す相手が部屋にいない');
    }

    if (_target !== null) {
      // 権限移譲
      await update_rooms(
        { hostId: _target[0].userId },
        { roomId: params.roomId },
        session
      );
      // 権限移譲しました
      await create_talks(
        {
          roomId: params.roomId,
          roomName: _target[0].roomName,
          userId: null,
          userName: '',
          iconId: 0,
          ip: '0.0.0.0',
          kind: 0,
          message: `${_target[0].userName}さんに権限が移譲されました`,
        },
        session
      );
    }

    // 退室
    await update_roomId({ id: params.id, roomId: '' }, session);

    const _user = await find_user(params.id);

    // 退室しました
    await create_talks(
      {
        roomId: params.roomId,
        roomName: _room_info[0].roomName,
        userId: null,
        userName: '',
        iconId: 0,
        ip: '0.0.0.0',
        kind: 0,
        message: `${_user[0].name}さんが退室しました`,
      },
      session
    );

    // 画像のパスが格納されているドキュメント
    const _image_doc = await find_kind1({ roomId: params.roomId });

    if (_room_info.length === 1) {
      // 部屋削除
      await delete_room(params.roomId);

      // トーク履歴削除
      await delete_talks({ roomId: params.roomId }, session);

      // 既読削除
      await delete_kidokus({ roomId: params.roomId }, session);

      // 部屋ブラックリスト削除
      await delete_room_blacklists(params.roomId, session);
    }

    // 行ロック解除
    await delete_transactions(params.id, session);

    // 行ロック解除
    await delete_transactions(params.roomId, session);

    if (_target !== null) {
      await delete_transactions(_target[0].userId, session);
    }

    // コミット
    await session.commitTransaction();
    // 切断
    session.endSession();

    return {
      result: true,
      delete_flag: _room_info.length === 1 ? true : false,
      images: _image_doc.map((m) => m.message),
    };
  } catch (err) {
    // ロールバック
    await session.abortTransaction();
    // 切断
    session.endSession();

    return { result: false, images: [] };
  }
};
