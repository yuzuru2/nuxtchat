const FileType = require('file-type');
import { constant } from 'src/constant';

import { update_updatedAt } from 'src/mongoose/model/users';
import { find_info_rooms } from 'src/mongoose/model/rooms';
import { create as create_talks } from 'src/mongoose/model/talks';
import { upload } from 'src/firebase/storage';

export const file_create = async (params: {
  id: string;
  roomId: string;
  ip: string;
  image: Buffer;
}) => {
  const _room_info = await find_info_rooms({ roomId: params.roomId });
  if (_room_info.length === 0) {
    return null;
  }

  // mimeチェック
  const _type = await FileType.fromBuffer(params.image);

  if (
    !(
      _type.mime === 'image/jpeg' ||
      _type.mime === 'image/png' ||
      _type.mime === 'image/gif'
    )
  ) {
    return null;
  }

  // 2MB以上は保存しない
  if (params.image.length > constant.UPLOAD_MAX_SIZE) {
    return null;
  }

  // ハッシュ生成用
  const _s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const _file_name =
    [...Array(30)]
      .map(() => _s[Math.floor(Math.random() * _s.length)])
      .join('') +
    new Date().getTime() +
    '.' +
    _type.ext;

  // firebaseにアップロード
  if ((await upload(_file_name, params.image, _type)) === false) {
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
    kind: 1,
    message: _file_name,
  });

  // 更新
  await update_updatedAt(params.id);

  return _talks[0].talkId;
};
