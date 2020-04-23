/**
 * コアモジュール
 */
import * as Express from 'express';
import * as Helmet from 'helmet';
import * as BodyParser from 'body-parser';
import * as Cors from 'cors';
import * as http from 'http';
import * as socketio from 'socket.io';
import * as cookieParser from 'cookie-parser';

import { v1 as socketio_v1 } from 'src/socketio/v1';
import { constant } from 'src/constant';
import { i_io_server } from 'src/interface';

import { create_user } from 'src/express/v1/users/create';
import { entering_room } from 'src/express/v1/users/entering_room';
import { logout } from 'src/express/v1/users/logout';
import { exit_room } from 'src/express/v1/users/exit_room';

import { create_rooms } from 'src/express/v1/rooms/create';
import { room_info } from 'src/express/v1/rooms/room_info';
import { list } from 'src/express/v1/rooms/list';
import { update_room_name } from 'src/express/v1/rooms/update_room_name';
import { update_upper } from 'src/express/v1/rooms/update_upper';
import { update_hostId } from 'src/express/v1/rooms/update_hostId';

import { create as text_create } from 'src/express/v1/talks/create';
import { create as file_create } from 'src/express/v1/talks/file_create';

import { create as room_blacklists } from 'src/express/v1/room_blacklists/create';

import { home } from 'src/express/v1/home';

// ミドルウエア
import { authorization } from 'src/express/v1/middleware/authorization';
import { blacklist } from 'src/express/v1/middleware/blacklist';
import { user } from 'src/express/v1/middleware/user';
import { middleware_error } from 'src/express/v1/middleware/error';

const app = Express();
const server = http.createServer(app).listen(3000);
export const io = socketio(server) as i_io_server;

export const v1 = () => {
  const route = '/api/v1';

  // サーバ情報隠蔽
  app.disable('x-powered-by');

  // セキュリティ対策
  app.use(Helmet());

  // POSTリクエストを使えるようにする
  app.use(BodyParser.json({ limit: '1mb' }));

  // クッキーを使えるようにする
  app.use(cookieParser());

  // CORS
  app.use(
    Cors({ origin: constant.ORIGIN[process.env.NODE_ENV], credentials: true })
  );

  // AUTHORIZATION Bearerチェック
  app.use(authorization);

  // ブラックリストチェック
  app.use(blacklist);

  // ユーザ認証
  app.use(user);

  // エラーハンドリング
  app.use(middleware_error);

  // ユーザ作成
  app.post(route + constant.URL['/users/create'], create_user);

  // ログアウト
  app.post(route + constant.URL['/users/logout'], logout);

  // 部屋作成
  app.post(route + constant.URL['/rooms/create'], create_rooms);

  // 入室
  app.put(route + constant.URL['/users/entering_room'], entering_room);

  // 退室
  app.put(route + constant.URL['/users/exit_room'], exit_room);

  // テキスト投稿
  app.post(route + constant.URL['/talks/text_create'], text_create);

  // 画像投稿
  app.post(route + constant.URL['/talks/file_create'], file_create);

  // 権限移譲
  app.put(route + constant.URL['/rooms/update_hostId'], update_hostId);

  // 人数変更
  app.put(route + constant.URL['/rooms/update_upper'], update_upper);

  // 部屋名変更
  app.put(route + constant.URL['/rooms/update_roomName'], update_room_name);

  // 追放
  app.post(route + constant.URL['/room_blacklists/create'], room_blacklists);

  // home
  app.get(route + constant.URL['/home'], home);

  // 部屋一覧
  app.get(route + constant.URL['/rooms/list'], list);

  // 部屋情報・トーク一覧
  app.get(route + constant.URL['/rooms/info'], room_info);

  socketio_v1();
};
