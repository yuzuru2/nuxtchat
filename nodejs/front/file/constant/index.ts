export const constant = {
  TITLE: 'nuxtオープンチャット',

  /**
   * リクエストURL
   */
  REQUEST_URL: {
    development: '',
    production: `http://${process.env.SERVER_IP}:${process.env.BACKEND_PORT}/api/v1`,
  },

  WEBSOCKT_URL: {
    development: '',
    production: `http://${process.env.SERVER_IP}:${process.env.BACKEND_PORT}`,
  },

  THIS_URL: {
    development: '',
    production: `http://${process.env.SERVER_IP}:${process.env.FRONTEND_PORT}`,
  },

  // firebaseストレージ バケット名
  GOOGLE_STORAGE_BUCKET: `${process.env.FIREBASE_STORAGE_BUCKET}`,

  /**
   * リクエストヘッダー
   */
  HEADER: {
    Authorization: 'Bearer abc',
    'Content-Type': 'application/json',
  },

  JWT_TOKEN: 'jwt_token',

  // websocket用
  BROADCAST: 'BROADCAST',
  TALK_INFO: 'TALK_INFO',
  EXILE: 'EXILE',

  URL: ['/', '/lounge', '/room'],

  // ファイルアップロードサイズ上限
  UPLOAD_MAX_SIZE: 2000000,

  EXPRESS_URL: {
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

  PNG: [
    '#3366cc', // 0
    '#ff66cc', // 1
    '#996666', // 2
    '#ffcc66', // 3
    '#ccffff', // 4
    '#ffccff', // 5
    '#336699', // 6
    '#9933cc', // 7
    '#996633', // 8
    '#339900', // 9
    '#ff9999', // 10
    '#cccc66', // 11
    '#3366ff', // 12
    '#66ff00', // 13
    '#ff6666', // 14
    '#993333', // 15
    '#9999cc', // 16
    '#ffcc33', // 17
    '#ff66ff', // 18
    '#666633', // 19
    'lightgreen', // 20
    'lightblue', // 21
    'lightpink', // 22
    '#ccccff', // 23
    '#ff9872', // 24
    'rgb(235, 170, 213)', // 25
  ],
};
