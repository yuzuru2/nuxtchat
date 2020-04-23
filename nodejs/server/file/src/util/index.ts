// npm i --save moment
import * as fs from 'fs';
import * as moment from 'moment';

/**
 * エラーログ作成
 * @param path
 * @param message
 */
export const create_error_log = (file_name: string, message: string) => {
  return new Promise(async (resolve) => {
    // testなら
    if (process.env.NODE_ENV === 'test') {
      resolve();
      return;
    }

    const _body = `${moment(new Date()).format(
      'YYYY-MM-DD HH:mm:ss'
    )}\n${message}\n\n`;

    fs.mkdir(`${process.cwd()}/log`, () => {
      fs.appendFile(`${process.cwd()}/log/${file_name}`, _body, () => {
        resolve();
      });
    });
  });
};

export const shaping_ip = (ip: string) => {
  if (ip.substr(0, 7) == '::ffff:') {
    ip = ip.substr(7);
  }

  return ip;
};

/**
 * socket.io IPアドレス取得
 * @param socket
 */
export const socket_get_ip = (socket: SocketIO.Socket): string => {
  let _ip: string =
    socket.request.headers['x-forwarded-for'] ||
    socket.request.connection.remoteAddress;
  if (_ip.substr(0, 7) == '::ffff:') {
    _ip = _ip.substr(7);
  }

  return _ip;
};
