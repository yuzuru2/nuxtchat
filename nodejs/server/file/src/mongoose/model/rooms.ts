/**
 * コアモジュール
 */
import * as mongoose from 'mongoose';

/**
 * mongoose
 */
import { Schema } from 'src/mongoose';

const model_name = 'rooms';

interface _interface {
  roomId: string;
  name: string;
  upper: number;
  hostId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * interface
 */
interface i_model extends mongoose.Document {
  roomId: string;
  name: string;
  upper: number;
  hostId: string;
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
    name: { type: String, minlength: 1, maxlength: 20 },
    upper: {
      type: Number,
      min: 2,
      max: 15,
      validate: {
        validator: (v) => {
          if (!Number.isInteger(v)) {
            return false;
          }
          return true;
        },
      },
    },
    hostId: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  }).index({ roomId: 1 }, { unique: true })
);

/**
 * 部屋作成
 * @param params
 */
export const create = async (
  params: Pick<i_model, 'name' | 'upper' | 'hostId'>
) => {
  const _data: _interface = {
    roomId: String(new mongoose.mongo.ObjectId()),
    name: params.name,
    upper: params.upper,
    hostId: params.hostId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return (await model.insertMany([_data])) as i_model[];
};

/**
 * 部屋削除
 * @param roomId
 */
export const delete_room = async (roomId: string) => {
  return await model.deleteMany({ roomId: roomId });
};

/**
 * 部屋更新
 * 部屋名・部屋上限人数・ルームホスト
 * @param params
 * @param roomId
 * @param session
 */
export const update_rooms = async (
  params:
    | Pick<i_model, 'name'>
    | Pick<i_model, 'upper'>
    | Pick<i_model, 'hostId'>,
  params_roomId: Pick<i_model, 'roomId'>,
  session?: mongoose.ClientSession
) => {
  return await model.updateMany(
    params_roomId,
    { $set: params },
    session === undefined ? {} : { session }
  );
};

/**
 * ルーム情報
 * @param roomId
 */
export const find_info_rooms = async (params?: Pick<i_model, 'roomId'>) => {
  return (await model.aggregate([
    {
      $match: {
        roomId: params === undefined ? { $ne: '' } : params.roomId,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'roomId',
        foreignField: 'roomId',
        as: 'users_info',
      },
    },
    { $unwind: '$users_info' },
    {
      $sort: { roomId: -1 },
    },
    {
      $project: {
        roomId: '$roomId',
        roomName: '$name',
        userId: '$users_info.id',
        userName: '$users_info.name',
        iconId: '$users_info.iconId',
        upper: '$upper',
        hostId: '$hostId',
      },
    },
  ])) as {
    roomId: string;
    roomName: string;
    userId: string;
    userName: string;
    iconId: number;
    upper: number;
    hostId: string;
  }[];
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
