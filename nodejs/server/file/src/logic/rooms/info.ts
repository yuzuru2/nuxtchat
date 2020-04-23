/**
 * model
 */
import { find_info_rooms } from 'src/mongoose/model/rooms';
import { find } from 'src/mongoose/model/talks';

export const info = async (roomId: string) => {
  return {
    talk_list: await find({ roomId: roomId }),
    room_list: await find_info_rooms({ roomId: roomId }),
  };
};
