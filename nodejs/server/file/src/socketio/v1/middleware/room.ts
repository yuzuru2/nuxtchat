import { i_io_server, i_socket_params } from 'src/interface';

export const room = async (
  socket: i_socket_params,
  next: i_io_server['NextFunction']
) => {
  socket.join(socket.ROOMID);
  next();
};
