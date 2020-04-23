/**
 * コアモジュール
 */
import * as mongoose from 'mongoose';

/**
 * mongoose
 */
import { Schema } from 'src/mongoose';

const model_name = 'kidokus';

interface _interface {
  talkId: string;
  userId: string;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * interface
 */
interface i_model extends mongoose.Document {
  talkId: string;
  userId: string;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * model
 */
const model = mongoose.model(
  model_name,
  new Schema({
    talkId: { type: String },
    roomId: { type: String },
    userId: { type: String },
    createdAt: { type: Date },
  }).index({ talkId: 1, userId: 1 }, { unique: true })
);

/**
 * 既読作成
 * @param params
 * @param params_userId
 */
export const create = async (
  params: Pick<i_model, 'talkId' | 'roomId' | 'userId'>[],
  params_userId: Pick<i_model, 'userId'>
) => {
  // 挿入する行だけ抜き取る
  const _data = params.reduce((accumulator: _interface[], current) => {
    if (current.userId !== null && current.userId !== params_userId.userId) {
      accumulator.push({
        talkId: current.talkId,
        userId: params_userId.userId,
        roomId: current.roomId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return accumulator;
  }, []);

  if (_data.length === 0) {
    return false;
  }

  let ret = true;

  await model.insertMany(_data, { ordered: false }).catch((e) => {
    // 挿入されたデータが0件なら
    if (e.result.result.nInserted) {
      ret = false;
    }
  });

  return ret;
};

/**
 * 投稿時に既読つける
 * @param params
 */
export const create2 = async (
  params: Pick<i_model, 'talkId' | 'roomId' | 'userId'>[]
) => {
  await model.insertMany(params, { ordered: false }).catch((e) => {});
};

/**
 * 削除
 * @param params
 */
export const delete_kidokus = async (
  params: Pick<i_model, 'roomId'>,
  session?: mongoose.ClientSession
) => {
  return await model.deleteMany(params, { session });
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
