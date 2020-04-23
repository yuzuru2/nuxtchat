<style scoped>
.input_area {
  background-color: #eee;
}
</style>

<template>
  <div>
    <!-- ローディング画面 -->
    <Loading v-if="!display"></Loading>

    <div v-if="display">
      <div class="chat_container">
        <div class="input_area">
          <div>
            <b-button type="button" class="btn btn-info" v-b-modal.modal-1>詳細</b-button>

            <DetailModal />

            <label style="margin-left: 40px;">
              <span class="btn btn-success">
                画像投稿
                <input type="file" accept="image/*" @change="fileup" style="display: none;" />
              </span>
            </label>

            <div style="float: right;">
              <button type="button" class="btn btn-danger" @click="exit_room">退室</button>
            </div>
          </div>

          <div class="form-group">
            <textarea
              class="form-control"
              id="chat_textarea"
              rows="3"
              placeholder="メッセージ150文字以内"
              maxlength="150"
              v-model="message"
              v-on:keyup.enter="send_message"
            ></textarea>
          </div>

          <div class="text-right">
            <button class="btn btn-primary" @click="send_message">投稿</button>
          </div>
        </div>

        <br />
        <br />

        <TalkList />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { constant } from "~/constant";
import { i_responce } from "~/interface";
import { get_request, post_request, put_request } from "~/utils/request";
import { RoomStore } from "~/store";
import { socket_init, socket_disconnect } from "~/socketio";

import Loading from "~/components/loading.vue";
import DetailModal from "~/components/room/modal.vue";
import TalkList from "~/components/room/list.vue";

import * as io from "socket.io-client";
const FileType = require("file-type");

export default {
  components: { Loading, DetailModal, TalkList },
  data() {
    return {
      display: true,
      message: ""
    };
  },

  mounted() {
    socket_init();
  },

  destroyed() {
    socket_disconnect();
  },

  methods: {
    // テキスト送信
    async send_message() {
      document.getElementById("chat_textarea").blur();
      const _message = this.message.trim();

      if (_message.length === 0 || _message === "\n") {
        this.message = "";
        return;
      }

      this.message = "";

      const _res = await post_request("/talks/text_create", {
        message: _message
      });

      if (_res.status !== 200) {
        return;
      }
    },

    // 退室
    async exit_room() {
      if (!confirm("退室しますか?")) {
        return;
      }

      const _res = await put_request("/users/exit_room", {});

      if (_res.status !== 200) {
        return;
      }

      const _ret: i_responce["/users/exit_room"] = await _res.json();
      if (_ret.STATUS !== "2") {
        socket_disconnect();
        location.reload();
      }
    },

    // ファイルアップ
    fileup(e) {
      const file = e.target.files;
      const reader = new FileReader();

      reader.onload = async function(event: any) {
        try {
          const _base64 = event.target.result;

          // 余計な文字列を取り除く
          const _file_data = _base64.replace(/^data:\w+\/\w+;base64,/, "");

          // デコード
          const _decode_file = Buffer.from(_file_data, "base64");

          const _type = await FileType.fromBuffer(_decode_file);

          // 画像ファイルかチェック
          if (
            !(
              _type.mime === "image/jpeg" ||
              _type.mime === "image/png" ||
              _type.mime === "image/gif"
            )
          ) {
            alert("画像ファイルが選択されていません");
            return;
          }

          // 2MB以上は保存しない
          if (_decode_file.length > constant.UPLOAD_MAX_SIZE) {
            alert("ファイルサイズは2MB以内です");
            return;
          }

          await post_request("/talks/file_create", { image: _decode_file });
        } catch (e) {
          return;
        }
      };

      if (file[0] === undefined) {
        alert("ファイルが選択されていません");
      } else {
        reader.readAsDataURL(file[0]);
      }
    }
  },

  async fetch({ redirect, req }) {
    const _res = await get_request("/rooms/info", req);

    if (_res.status !== 200) {
      return;
    }

    const _ret: i_responce["/rooms/info"] = await _res.json();

    if (_ret.STATUS !== "2") {
      redirect(constant.URL[_ret.STATUS]);
      return;
    }

    RoomStore.set_talk_list(_ret.talk_list);
    RoomStore.set_room_list(_ret.room_list);
    RoomStore.set_userId(_ret.userId);
  }
};
</script>
