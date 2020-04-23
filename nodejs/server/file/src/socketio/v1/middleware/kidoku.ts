import { i_io_server, i_socket_params } from 'src/interface';

import { create as create_kidoku } from 'src/mongoose/model/kidokus';
import { find as find_talks } from 'src/mongoose/model/talks';

export const kidoku = async (
  socket: i_socket_params,
  next: i_io_server['NextFunction']
) => {
  const _list = await find_talks({ roomId: socket.ROOMID });
  await create_kidoku(
    _list.map((m) => {
      return {
        roomId: socket.ROOMID,
        talkId: m.talkId,
        userId: m.userId,
      };
    }),
    { userId: socket.ID }
  );

  next();
};
