/**
 * コアモジュール
 */
import * as mongoose from 'mongoose';

/**
 * mongoose
 */
import { Schema } from 'src/mongoose';

const model_name = 'users';

interface _interface {
  id: string;
  name: string;
  iconId: number;
  roomId: string;
  ip: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * interface
 */
interface i_model extends mongoose.Document {
  id: string;
  name: string;
  iconId: number;
  roomId: string;
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
    id: { type: String },
    name: { type: String, minlength: 1, maxlength: 15 },
    iconId: {
      type: Number,
      min: 0,
      max: 25,
      validate: {
        validator: (v) => {
          if (!Number.isInteger(v)) {
            return false;
          }
          return true;
        },
      },
    },
    roomId: { type: String },
    ip: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  }).index({ id: 1 }, { unique: true })
);

/**
 * ユーザ作成
 * @param params
 */
export const create = async (
  params: Pick<i_model, 'name' | 'iconId' | 'ip'>
) => {
  const _data: _interface = {
    id: String(new mongoose.mongo.ObjectId()),
    name: params.name,
    iconId: params.iconId,
    roomId: '',
    ip: params.ip,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return (await model.insertMany([_data])) as i_model[];
};

/**
 * ユーザチェック
 * @param id
 */
export const find_user = async (id: string) => {
  const _data: Pick<i_model, 'id'> = { id: id };
  return (await model.find(_data)) as i_model[];
};

/**
 * ユーザのupdatedAtを更新
 */
export const update_updatedAt = async (id: string) => {
  const _data: Pick<i_model, 'id'> = { id: id };
  const _set: Pick<i_model, 'updatedAt'> = { updatedAt: new Date() };
  return await model.updateMany(_data, { $set: _set });
};

/**
 * ログアウト
 * @param id
 */
export const delete_user = async (id: string) => {
  const _data: Pick<i_model, 'id'> = { id: id };
  return await model.deleteMany(_data);
};

/**
 * 10分間ノーアクションのユーザ
 */
export const find_exit_room_user = async () => {
  return (await model.find({
    roomId: {
      $ne: null,
    },
    updatedAt: {
      $lt: new Date(new Date().getTime() - 60 * 10 * 1000),
    },
  })) as i_model[];
};

/**
 * 入室・退室
 * @param params
 */
export const update_roomId = async (
  params: Pick<i_model, 'id' | 'roomId'>,
  session?: mongoose.ClientSession
) => {
  const _data: Pick<i_model, 'id'> = { id: params.id };
  const _set: Pick<i_model, 'roomId'> = { roomId: params.roomId };
  return await model.updateMany(
    _data,
    { $set: _set },
    session === undefined ? {} : { session }
  );
};

/**
 * テスト用create
 */
export const create_test_model = async (
  params: Pick<i_model, 'name' | 'iconId' | 'ip'>
) => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('テストの時だけ使ってください');
  }

  const _data: _interface = {
    id: String(new mongoose.mongo.ObjectId()),
    name: params.name,
    iconId: params.iconId,
    roomId: '',
    ip: params.ip,
    createdAt: new Date(),
    updatedAt: new Date(new Date().getTime() - 60 * 10 * 1000),
  };
  return (await model.insertMany([_data])) as i_model[];
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
