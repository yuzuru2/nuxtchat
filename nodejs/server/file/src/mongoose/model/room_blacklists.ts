/**
 * コアモジュール
 */
import * as mongoose from 'mongoose';

/**
 * mongoose
 */
import { Schema } from 'src/mongoose';

const model_name = 'room_blacklists';

interface _interface {
  roomId: string;
  userId: string;
  ip: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * interface
 */
interface i_model extends mongoose.Document {
  roomId: string;
  userId: string;
  ip: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * model
 */
const model = mongoose.model(
  model_name,
  new Schema({
    roomId: { type: String },
    userId: { type: String },
    ip: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  }).index({ roomId: 1, userId: 1 }, { unique: true })
);

/**
 * 作成
 * @param params
 * @param session
 */
export const create = async (
  params: Pick<i_model, 'roomId' | 'userId' | 'ip'>,
  session: mongoose.ClientSession
) => {
  const _data: _interface = {
    roomId: params.roomId,
    userId: params.userId,
    ip: params.ip,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return await model.insertMany(
    _data,
    session === undefined ? {} : { session }
  );
};

/**
 * 削除
 * @param roomId
 * @param session
 */
export const delete_room_blacklists = async (
  roomId: string,
  session: mongoose.ClientSession
) => {
  return await model.deleteMany(
    { roomId: roomId },
    session === undefined ? {} : { session }
  );
};

/**
 * 検索
 * @param params
 */
export const find = async (
  params: Pick<i_model, 'roomId' | 'userId' | 'ip'>
) => {
  const _ret = await model.find({
    $or: [{ userId: params.userId }, { ip: params.ip }],
    roomId: params.roomId,
  });

  if (_ret.length === 0) {
    return false;
  } else {
    return true;
  }
};

/**
 * テスト用delete
 */
export const delete_test_model = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('テストの時だけ使ってください');
  }

  return await model.deleteMany({});
};
