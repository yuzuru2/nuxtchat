export const constant = {
  // Bearer key
  AUTHORIZATION_KEY: 'Bearer abc',

  // websocket用
  BROADCAST: 'BROADCAST',
  TALK_INFO: 'TALK_INFO',
  EXILE: 'EXILE',

  STATUS: 'STATUS',
  JWT_TOKEN: 'jwt_token',

  // 2MB ファイルアップロードサイズ上限
  UPLOAD_MAX_SIZE: 2000000,

  // firebaseストレージ バケット名
  FIREBASE_STORAGE: `${process.env.FIREBASE_STORAGE_BUCKET}`,

  // オリジン
  ORIGIN: {
    development: '',
    production: `http://${process.env.SERVER_IP}:${process.env.FRONTEND_PORT}`,
  },

  URL: {
    // ユーザ作成
    ['/users/create']: '/users/create',

    // ログアウト
    ['/users/logout']: '/users/logout',

    // 部屋作成
    ['/rooms/create']: '/rooms/create',

    // 入室
    ['/users/entering_room']: '/users/entering_room',

    // 退室
    ['/users/exit_room']: '/users/exit_room',

    // テキスト投稿
    ['/talks/text_create']: '/talks/text_create',

    // 画像投稿
    ['/talks/file_create']: '/talks/file_create',

    // 権限移譲
    ['/rooms/update_hostId']: '/rooms/update_hostId',

    // 人数変更
    ['/rooms/update_upper']: '/rooms/update_upper',

    // 部屋名変更
    ['/rooms/update_roomName']: '/rooms/update_roomName',

    // 追放
    ['/room_blacklists/create']: '/room_blacklists/create',

    // home
    ['/home']: '/home',

    // 部屋一覧
    ['/rooms/list']: '/rooms/list',

    // 部屋情報・トーク一覧
    ['/rooms/info']: '/rooms/info',
  },

  // apiのバージョン
  API_VERSION: 'v1',
};
