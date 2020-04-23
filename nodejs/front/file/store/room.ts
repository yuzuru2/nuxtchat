import { Mutation, VuexModule, Module } from 'vuex-module-decorators';

export interface i_room {
  userId: string;

  talk_list: {
    talkId: string;
    userId: string;
    userName: string;
    iconId: number;
    message: string;
    kind: number;
    kidokus: string[];
    createdAt: Date;
  }[];

  room_list: {
    roomId: string;
    roomName: string;
    userId: string;
    userName: string;
    iconId: number;
    upper: number;
    hostId: string;
  }[];

  jwt_token: string;
}

@Module({ stateFactory: true, namespaced: true, name: 'room' })
export default class Room extends VuexModule implements i_room {
  userId: string = '';
  talk_list: {
    talkId: string;
    userId: string;
    userName: string;
    iconId: number;
    message: string;
    kind: number;
    kidokus: string[];
    createdAt: Date;
  }[] = [];

  room_list: {
    roomId: string;
    roomName: string;
    userId: string;
    userName: string;
    iconId: number;
    upper: number;
    hostId: string;
  }[] = [];

  jwt_token: string = '';

  @Mutation
  set_userId(userId: string) {
    this.userId = userId;
  }

  @Mutation
  set_talk_list(
    talk_list: {
      talkId: string;
      userId: string;
      userName: string;
      iconId: number;
      message: string;
      kind: number;
      kidokus: string[];
      createdAt: Date;
    }[]
  ) {
    this.talk_list = talk_list;
  }

  @Mutation
  set_room_list(
    room_list: {
      roomId: string;
      roomName: string;
      userId: string;
      userName: string;
      iconId: number;
      upper: number;
      hostId: string;
    }[]
  ) {
    this.room_list = room_list;
  }

  @Mutation
  set_jwt_token(jwt_token: string) {
    this.jwt_token = jwt_token;
  }
}
