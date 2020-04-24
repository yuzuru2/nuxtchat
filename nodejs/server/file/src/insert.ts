process.env.TZ = 'Asia/Tokyo';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import { create, update_roomId } from 'src/mongoose/model/users';
import { entering_room } from 'src/logic/rooms/entering_room';
import { create as room_create } from 'src/mongoose/model/rooms';
// 乱数表
const ran: string[] = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const main = async () => {
  console.log(new Date());
  let roomId = '';
  let room_name = 0;

  for (let i = 0; i < 1000; i++) {
    try {
      // ユーザ作成
      const r_name = Math.floor(Math.random() * 15) + 1;
      let user_name = '';
      for (let j = 0; j < r_name; j++) {
        user_name += ran[Math.floor(Math.random() * ran.length)];
      }

      // ユーザ作成
      const _user = await create({
        name: user_name,
        iconId: Math.floor(Math.random() * 26),
        ip: '1.1.1.1',
      });

      // %14で部屋作成
      if (i % 14 === 0) {
        const _room = await room_create({
          name: room_name++ + '',
          upper: 15,
          hostId: _user[0].id,
        });

        // 部屋のid
        roomId = _room[0].roomId;

        await update_roomId({ id: _user[0].id, roomId: roomId });
      } else {
        // 入室
        await entering_room({ id: _user[0].id, roomId: roomId, ip: '1.1.1.1' });
      }
    } catch (e) {}
  }
  console.log(new Date());
  console.log('fin');
};

// main();

// import { find_kind1 } from 'src/mongoose/model/talks';
// const a = async () => {
//   console.log(await find_kind1({ roomId: '5e9eb12da885ce0f582b986c' }));
// };
// a();
