import * as fs from 'fs';
import * as Cookie from 'cookie';

import { i_io_server, i_socket_params } from 'src/interface';
import { decode } from 'src/jwt';
import { socket_get_ip } from 'src/util';

import { create } from 'src/mongoose/model/blacklists';
import { find_user } from 'src/mongoose/model/users';

// 公開鍵
const public_key: Buffer = fs.readFileSync(
  `${process.cwd()}/key/public-key.pem`
);

export const user = async (
  socket: i_socket_params,
  next: i_io_server['NextFunction']
) => {
  try {
    const _cookies: { jwt_token: string } = Cookie.parse(
      socket.request.headers.cookie || ''
    );
    const _user = await decode<{ id: string }>(_cookies.jwt_token, public_key);

    if (_user === null) {
      return;
    }

    // 改ざんしたトークンが送られて来たら
    if (_user === undefined) {
      // ブラックリスト入り
      await create(socket_get_ip(socket));
      return;
    }

    const _ret = await find_user(_user.id);

    if (_ret.length === 0) {
      return;
    }

    if (_ret[0].roomId === '') {
      return;
    }

    socket.ID = _ret[0].id;
    socket.ROOMID = _ret[0].roomId;
    socket.IP = socket_get_ip(socket);

    next();
  } catch (err) {}
};
