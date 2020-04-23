<style scoped></style>

<template>
  <div>
    <!-- ローディング画面 -->
    <Loading v-if="!display"></Loading>

    <div v-if="display">
      <div class="chat_container">
        <br />
        <b-button type="button" class="btn bg-primary" v-b-modal.modal-1>部屋をつくる</b-button>
        <button type="button" class="btn btn-danger" style="float: right;" @click="logout">ログアウト</button>

        <Modal />

        <br />
        <br />

        <RoomList :list="list" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as _ from "lodash";

import { constant } from "~/constant";
import { i_responce } from "~/interface";
import { get_request, post_request, put_request } from "~/utils/request";
import { RoomStore } from "~/store";

// components
import Loading from "~/components/loading.vue";
import Modal from "~/components/lounge/modal.vue";
import RoomList from "~/components/lounge/list.vue";

export default {
  components: { Loading, Modal, RoomList },

  data() {
    return {
      display: true,
      list: []
    };
  },

  async asyncData({ params, redirect, req }) {
    const _res = await get_request(constant.EXPRESS_URL["/rooms/list"], req);

    if (_res.status !== 200) {
      return;
    }

    const _ret: i_responce["/rooms/list"] = await _res.json();

    if (_ret.STATUS !== "1") {
      redirect(constant.URL[_ret.STATUS]);
      return;
    }

    return {
      list: _.sortBy(
        _.groupBy(_ret.room_list, "roomId"),
        item => -item[0]["roomId"]
      )
    };
  },

  methods: {
    async logout() {
      if (!confirm("ログアウトしますか?")) {
        return;
      }

      this.display = false;
      const _res = await post_request("/users/logout", {});

      if (_res.status !== 200) {
        return;
      }

      this.$router.push(constant.URL[0]);
    }
  }
};
</script>
