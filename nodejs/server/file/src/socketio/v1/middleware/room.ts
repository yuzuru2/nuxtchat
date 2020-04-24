import { i_io_server, i_socket_params } from 'src/interface';

import { update_updatedAt } from 'src/mongoose/model/users';

export const room = async (
  socket: i_socket_params,
  next: i_io_server['NextFunction']
) => {
  // updateAt ip
  await update_updatedAt(socket.ID, socket.IP);

  socket.join(socket.ROOMID);
  next();
};
