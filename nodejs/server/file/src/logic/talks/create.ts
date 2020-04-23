import { update_updatedAt } from 'src/mongoose/model/users';
import { find_info_rooms } from 'src/mongoose/model/rooms';
import { create as create_talks } from 'src/mongoose/model/talks';

const gimmick = (str: string) => {
  const omikuji_arr = ['大吉', '中吉', '小吉', '吉', '半吉', '末吉', '末小吉'];

  const dice_arr = [1, 2, 3, 4, 5, 6];

  switch (str) {
    case 'サイコロ':
      return `サイコロを振って${
        dice_arr[Math.floor(Math.random() * dice_arr.length)]
      }が出ました`;
    case 'おみくじ':
      return `おみくじの結果: ${
        omikuji_arr[Math.floor(Math.random() * omikuji_arr.length)]
      }`;
    default:
      return null;
  }
};

export const create = async (params: {
  id: string;
  roomId: string;
  ip: string;
  message: string;
}) => {
  const _room_info = await find_info_rooms({ roomId: params.roomId });
  if (_room_info.length === 0) {
    return null;
  }

  const _user = _room_info.filter((m) => m.userId === params.id);

  // 投稿
  const _talks = await create_talks({
    roomId: params.roomId,
    roomName: _room_info[0].roomName,
    userId: params.id,
    userName: _user[0].userName,
    iconId: _user[0].iconId,
    ip: params.ip,
    kind: 0,
    message: params.message,
  });

  // ギミック
  const _ret = gimmick(params.message);
  if (_ret !== null) {
    await create_talks({
      roomId: params.roomId,
      roomName: _room_info[0].roomName,
      userId: null,
      userName: '',
      iconId: 0,
      ip: '0.0.0.0',
      kind: 0,
      message: _ret,
    });
  }

  // 更新
  await update_updatedAt(params.id);

  return _talks[0].talkId;
};
