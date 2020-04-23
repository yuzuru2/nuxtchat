/**
 * コアモジュール
 */
import * as Express from 'express';

export interface i_custom_requst extends Express.Request {
  query: {
    id: string;
    roomId: string;
    status: string;
  };
  cookies: {
    jwt_token: string;
  };
}

export interface i_socket_params extends SocketIO.Socket {
  IP: string;
  ID: string;
  ROOMID: string;
}

export interface i_io_server extends SocketIO.Server {
  set: (key: string, value: number | string) => void;
  NextFunction: () => void;
}
