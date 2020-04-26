import {
  find_limit,
  limit_delete as talks_delete,
} from 'src/mongoose/model/talks';
import { limit_delete as kidoku_delete } from 'src/mongoose/model/kidokus';
import { delete_file } from 'src/firebase/storage';

export const delete_batch = async (roomId: string) => {
  const _list = await find_limit(roomId);

  if (_list.length === 0) {
    return;
  }

  const _talkIds = _list.reduce((accumulator: string[], row) => {
    accumulator.push(row.talkId);
    return accumulator;
  }, []);

  await talks_delete(_talkIds);
  await kidoku_delete(_talkIds);

  const _images = _list.filter((m) => m.kind == 1);
  for (let row of _images) {
    await delete_file(row.message);
  }
};
