/**
 * コアモジュール
 */
import * as mongoose from 'mongoose';

/**
 * mongoose
 */
import { Schema } from 'src/mongoose';

const model_name = 'transactions';

interface _interface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * interface
 */
interface i_model extends mongoose.Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * model
 */
const model = mongoose.model(
  model_name,
  new Schema({
    id: { type: String },
  }).index({ id: 1 }, { unique: true })
);

/**
 * 作成
 * @param id
 * @param session
 */
export const create = async (id: string, session: mongoose.ClientSession) => {
  const _data: _interface = {
    id: id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return await model.insertMany([_data], { session });
};

/**
 * 削除
 * @param id
 * @param session
 */
export const delete_transactions = async (
  id: string,
  session: mongoose.ClientSession
) => {
  return await model.deleteMany({ id: id }, { session });
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
