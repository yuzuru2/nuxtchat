export interface i_responce {
  home: {
    STATUS: string;
  };
  ['/users/create']: {
    STATUS: string;
    jwt_token: string;
  };
  ['/rooms/list']: {
    STATUS: string;
    room_list: {
      roomId: string;
      roomName: string;
      userId: string;
      userName: string;
      iconId: number;
      upper: number;
      hostId: string;
    }[];
  };
  ['/users/logout']: {
    STATUS: string;
  };
  ['/rooms/info']: {
    STATUS: string;
    userId: string;
    jwt_token: string;
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
  };
  ['/talks/text_create']: {
    STATUS: string;
  };
  ['/users/exit_room']: {
    STATUS: string;
  };
  ['/rooms/create']: {
    STATUS: string;
  };
  ['/users/entering_room']: {
    STATUS: string;
  };
  ['/rooms/update_room_name']: {
    STATUS: string;
  };
  ['/rooms/update_hostId']: {
    STATUS: string;
  };
  ['/room_blacklists/create']: {
    STATUS: string;
  };
}
