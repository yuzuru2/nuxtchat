/**
 * コアモジュール
 */
import * as mongoose from 'mongoose';

/**
 * mongoose
 */
import { Schema } from 'src/mongoose';

const model_name = 'blacklists';

interface _interface {
  ip: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * interface
 */
interface i_model extends mongoose.Document {
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
    ip: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  }).index({ ip: 1 }, { unique: true })
);

/**
 * 作成
 * @param params
 */
export const create = async (ip: string) => {
  const _data: _interface = {
    ip: ip,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return (await model.insertMany([_data])) as i_model[];
};

/**
 * 検索
 * @param params
 */
export const find = async (params: Pick<i_model, 'ip'>) => {
  const _ret = await model.find(params);
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
