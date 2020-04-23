<style scoped>
.bubble {
  max-width: 300px;
  padding: 10px 15px;
  border-radius: 15px;
  font-size: 15px;
  font-weight: bold;
  word-wrap: break-word;
  position: relative;
  margin-left: 10px;
  background-color: #fff;
}

.bubble::before {
  content: "";
  display: block;
  position: absolute;
  top: 5px;
  border: 8px solid transparent;
  left: -20px;
  -webkit-transform: rotate(25deg);
  transform: rotate(25deg);
  border-right: 18px solid #fff;
}

.icon_area {
  width: 80px;
}

.icon_area img {
  width: 50px;
}
.icon_area p {
  width: 100%;
  text-align: center;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  word-wrap: break-word;
  margin-top: 5px;
}

/* スマホ用 */
@media screen and (max-width: 767px) {
  .message {
    width: 70%;
    max-width: 230px;
  }

  .bubble {
    max-width: 220px;
  }
}
</style>

<template>
  <div>
    <template v-for="(row, i) in get_talk_list">
      <template v-if="row.kind === 0">
        <template v-if="row.userId === null">
          <div :key="i">
            <div class="text-center" style="color: #fff; font-weight: bold;">{{ row.message }}</div>

            <div
              class="text-right"
              style="color: #fff; font-size: 13px;"
            >{{ get_time(row.createdAt) }}</div>
          </div>
        </template>

        <template v-if="row.userId !== null">
          <div :key="i">
            <div class="row">
              <div class="icon_area">
                <div style="text-align: center;">
                  <img
                    :src="`img/${row.iconId}.png`"
                    v-bind:style="{ background: get_constant.PNG[row.iconId] }"
                  />
                </div>

                <p>{{ row.userName }}</p>
              </div>

              <div>
                <div class="bubble">{{ row.message }}</div>
              </div>
            </div>

            <div
              class="text-right"
              style="color: #fff; font-size: 13px;"
            >{{ get_time(row.createdAt) }}</div>

            <div
              class="text-right"
              style="color: #fff; font-size: 13px;"
            >既読: {{ row.kidokus.length }}</div>
          </div>
        </template>
      </template>

      <template v-if="row.kind === 1">
        <div :key="i">
          <div class="row">
            <div class="icon_area">
              <div style="text-align: center;">
                <img
                  :src="`img/${row.iconId}.png`"
                  v-bind:style="{ background: get_constant.PNG[row.iconId] }"
                />
              </div>

              <p>{{ row.userName }}</p>
            </div>

            <div>
              <div class="bubble">
                <img
                  :src="
                          `https://firebasestorage.googleapis.com/v0/b/${get_constant.GOOGLE_STORAGE_BUCKET}/o/${row.message}?alt=media`
                        "
                  width="150"
                />
              </div>
            </div>
          </div>

          <div
            class="text-right"
            style="color: #fff; font-size: 13px;"
          >{{ get_time(row.createdAt) }}</div>

          <div class="text-right" style="color: #fff; font-size: 13px;">既読: {{ row.kidokus.length }}</div>
        </div>
      </template>
    </template>
    <br />
  </div>
</template>
<script lang="ts">
import moment from "moment";
import { constant } from "~/constant";
import { RoomStore } from "~/store";

export default {
  computed: {
    get_talk_list: () => {
      return RoomStore.talk_list;
    },
    get_constant: () => {
      return constant;
    }
  },
  methods: {
    get_time(date: Date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>
