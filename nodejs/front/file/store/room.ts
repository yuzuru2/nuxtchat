import { Howl } from 'howler';
import { Mutation, VuexModule, Module } from 'vuex-module-decorators';
import { constant } from '~/constant';
import { RoomStore } from '~/store';

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

  title: string;

  sound_icon_opacity: number;
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

  title: string = constant.TITLE;

  sound_icon_opacity: number = 0.3;

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
    const tmp = this.talk_list;
    this.talk_list = talk_list;

    if (process.client && JSON.stringify(tmp) !== JSON.stringify(talk_list)) {
      const ring_sound = () => {
        if (this.sound_icon_opacity === 1) {
          const sound = new Howl({
            src: ['sound.mp3'],
          });
          sound.play();
        }
      };

      if (tmp.length === 0 && talk_list.length > 0) {
        this.title = '新着メッセージ';
        setTimeout(() => {
          RoomStore.set_title(constant.TITLE);
        }, 1500);

        ring_sound();
        return;
      }

      if (
        tmp.length > 0 &&
        talk_list.length > 0 &&
        tmp[0].talkId !== talk_list[0].talkId
      ) {
        this.title = '新着メッセージ';
        setTimeout(() => {
          RoomStore.set_title(constant.TITLE);
        }, 1500);

        ring_sound();
        return;
      }
    }
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

  @Mutation
  set_title(title: string) {
    this.title = title;
  }

  @Mutation
  set_sound_icon_opacity() {
    this.sound_icon_opacity = this.sound_icon_opacity === 1 ? 0.3 : 1;
  }
}
