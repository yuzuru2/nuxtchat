// npm i --save socket.io-client
// npm i --save-dev @types/socket.io-client
// npm i --save ifvisible.js@1.0.6

import * as io from 'socket.io-client';

import { constant } from '~/constant';
import { i_responce } from '~/interface';
import { RoomStore } from '~/store';

// 画面がアクティブ: true
let display_flag = true;

let socket = null;

export const socket_disconnect = () => {
  try {
    socket.disconnect();
    display_flag = false;
  } catch (err) {}
};

export const socket_init = () => {
  try {
    const ifvisible = require('ifvisible.js');

    socket = io.connect(constant.WEBSOCKT_URL[process.env.NODE_ENV], {
      transports: ['websocket'],
    });

    socket.on(constant.EXILE, async (data: { id: string }) => {
      if (location.pathname === '/room') {
        if (data.id === RoomStore.userId) {
          location.reload();
        }
      }
    });

    socket.on(constant.TALK_INFO, async (data: i_responce['/rooms/info']) => {
      if (location.pathname === '/room') {
        RoomStore.set_talk_list(data.talk_list);
        RoomStore.set_room_list(data.room_list);
      }
    });

    socket.on(constant.BROADCAST, async () => {
      if (location.pathname === '/room') {
        socket.emit(constant.TALK_INFO, {});
      }
    });

    socket.on('disconnect', async () => {
      socket.disconnect();
    });

    /**
     * 画面がアクティブになったとき
     */
    ifvisible.on('focus', async function() {
      display_flag = true;
    });

    /**
     * 画面が非アクティブになったとき
     */
    ifvisible.on('blur', async function() {
      display_flag = false;
      socket.disconnect();
    });

    // ソケット監視
    const surveillance = async () => {
      if (display_flag && !socket.connected && location.pathname === '/room') {
        const _res = await fetch(
          `${constant.REQUEST_URL[process.env.NODE_ENV]}/rooms/info`,
          {
            method: 'get',
            credentials: 'include',
            headers: { ...constant.HEADER },
          }
        );

        if (_res.status !== 200) {
          return;
        }

        const _ret: i_responce['/rooms/info'] = await _res.json();
        if (_ret.STATUS !== '2') {
          location.reload();
          return;
        }

        // 再接続
        socket.connect();
      }

      if (socket.connected && location.pathname !== '/room') {
        socket.disconnect();
      }

      setTimeout(surveillance, 250);
    };

    // socket監視開始
    surveillance();
  } catch (err) {}
};
