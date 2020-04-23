/**
 * コアモジュール
 */
import * as mongoose from 'mongoose';

/**
 * mongoose
 */
import { Schema } from 'src/mongoose';

const model_name = 'talks';

interface _interface {
  talkId: string;
  roomId: string;
  roomName: string;
  userId: string;
  userName: string;
  iconId: number;
  ip: string;
  kind: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * interface
 */
interface i_model extends mongoose.Document {
  talkId: string;
  roomId: string;
  roomName: string;
  userId: string;
  userName: string;
  iconId: number;
  ip: string;
  kind: number;
  message: string;
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
    roomName: { type: String },
    userId: { type: String },
    userName: { type: String },
    iconId: { type: Number },
    ip: { type: String },
    kind: { type: Number, min: 0, max: 1 },
    message: { type: String, minlength: 1, maxlength: 150 },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  }).index({ talkId: 1 }, { unique: true })
);

/**
 * 作成
 * @param params
 */
export const create = async (
  params: Pick<
    i_model,
    | 'roomId'
    | 'roomName'
    | 'userId'
    | 'userName'
    | 'iconId'
    | 'ip'
    | 'kind'
    | 'message'
  >,
  session?: mongoose.ClientSession
) => {
  const _data: _interface = {
    talkId: String(new mongoose.mongo.ObjectId()),
    roomId: params.roomId,
    roomName: params.roomName,
    userId: params.userId,
    userName: params.userName,
    iconId: params.iconId,
    ip: params.ip,
    kind: params.kind,
    message: params.message,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (await model.insertMany(
    [_data],
    session === undefined ? {} : { session }
  )) as i_model[];
};

export const find_kind1 = async (params: Pick<i_model, 'roomId'>) => {
  return (await model.find({ roomId: params.roomId, kind: 1 })) as i_model[];
};

/**
 * 削除
 * @param params_roomId
 */
export const delete_talks = async (
  params_roomId: Pick<i_model, 'roomId'>,
  session?: mongoose.ClientSession
) => {
  return await model.deleteMany(
    params_roomId,
    session === undefined ? {} : { session }
  );
};

/**
 * トーク一覧
 * @param params
 */
export const find = async (params: Pick<i_model, 'roomId'>) => {
  return (await model
    .aggregate([
      {
        $match: { roomId: params.roomId },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: 'kidokus',
          localField: 'talkId',
          foreignField: 'talkId',
          as: 'kidokus_info',
        },
      },
      {
        $project: {
          talkId: '$talkId',
          userId: '$userId',
          userName: '$userName',
          iconId: '$iconId',
          message: '$message',
          kind: '$kind',
          kidokus: '$kidokus_info.userId',
          createdAt: '$createdAt',
        },
      },
    ])
    .limit(30)) as {
    talkId: string;
    userId: string;
    userName: string;
    iconId: number;
    message: string;
    kind: number;
    kidokus: string[];
    createdAt: Date;
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
