## nuxtオープンチャット

## このリポジトリは何?

nuxtで作ったSSRなチャットのソースです。

## 成果物

https://nuxtchat.itsumen.com

## セットアップ

```
$ git clone https://github.com/yuzuru2/nuxtchat.git chat
$ cd chat

# portの開放は各自で設定してください
.envを編集 
SERVER_IP   → サーバのIP
NGINX_PORT  → フロントエンドサーバのポート番号 (お好きな番号を選んでください)
BACKEND_PORT → バックエンドサーバのポート番号 (お好きな番号を選んでください)

# firebase storageの秘密鍵 https://firebase.google.com/docs/admin/setup?hl=ja
vi nodejs/server/file/xxxx-firebase-adminsdk-xxxx.json

サーバを立ち上げる
$ sudo docker-compose up -d --build

# ブラウザでアクセスする
http://お使いのサーバのIP:FRONTEND_PORT

# サーバを落とす
$ sudo docker-compose down -v
```
