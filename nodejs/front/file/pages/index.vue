<style scoped>
li {
  list-style: none;
}

img {
  border: 2px solid #fff;
}
</style>

<template>
  <div>
    <!-- ローディング画面 -->
    <Loading v-if="!display"></Loading>

    <div v-if="display">
      <nav class="navbar sticky-top navbar-dark bg-info">
        <a class="navbar-brand" href>{{ get_constant.TITLE }}</a>
      </nav>
      <br />
      <div class="mx-auto" style="width: 300px;">
        <ul class="d-flex flex-wrap" style="padding-left: 0;">
          <li v-for="(item, i) of get_items" v-bind:key="i" style="margin: 3px;">
            <img
              v-if="i === icon"
              :src="item"
              width="52"
              @click="icon_click(i)"
              v-bind:style="{ background: get_constant.PNG[i] }"
            />
            <img
              v-else
              :src="item"
              width="52"
              style="opacity: 0.3;"
              @click="icon_click(i)"
              v-bind:style="{ background: get_constant.PNG[i] }"
            />
          </li>
        </ul>

        <input
          type="text"
          id="login_enter"
          class="form-control"
          placeholder="名前を入れてね"
          maxlength="15"
          v-model="name"
          v-on:keyup.enter="submit"
        />

        <br />

        <div class="text-center">
          <button type="button" class="btn btn-primary" @click="submit()">チャットを始める</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { constant } from "~/constant";
import { i_responce } from "~/interface";
import { get_request, post_request } from "~/utils/request";

import Loading from "~/components/loading.vue";

import { RoomStore } from "~/store";

export default {
  components: { Loading },

  data() {
    return {
      icon: 0,
      name: "",
      display: true
    };
  },

  computed: {
    get_constant: () => constant,
    get_items: () => {
      return [...Array(26)].map((_, i) => `/img/${i}.png`);
    }
  },

  async asyncData({ params, redirect, req }) {
    const _res = await get_request(constant.EXPRESS_URL["/home"], req);

    if (_res.status !== 200) {
      return;
    }

    const _ret: i_responce["home"] = await _res.json();

    if (_ret.STATUS !== "0") {
      redirect(constant.URL[_ret.STATUS]);
      return;
    }

    return {};
  },

  methods: {
    // アイコンクリック時
    icon_click(icon_nam: number) {
      this.icon = icon_nam;
    },

    // 送信
    async submit() {
      document.getElementById("login_enter").blur();
      const _name = this.name.trim();

      if (_name.length === 0 || _name === "\n") {
        this.name = "";
        return;
      }

      this.display = false;

      const _res = await post_request(constant.EXPRESS_URL["/users/create"], {
        name: this.name,
        iconId: this.icon
      });

      if (_res.status !== 200) {
        return;
      }

      this.$router.push(constant.URL[1]);
    }
  }
};
</script>
