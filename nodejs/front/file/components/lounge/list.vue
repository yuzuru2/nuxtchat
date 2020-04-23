<style scoped></style>
<template>
  <div>
    <template v-for="(row, i) in list">
      <div :key="i">
        <div class="card">
          <ul class="list-group list-group-flush">
            <li class="list-group-item" style="text-align: center;">
              {{ list[i][0].roomName }}
              <br />
              ({{ `${list[i].length}/${list[i][0].upper}` }})
            </li>

            <li
              class="list-group-item"
              style="text-align: center;"
              v-if="list[i].length < list[i][0].upper"
            >
              <button
                type="button"
                class="btn btn-success"
                @click="entering_room(list[i][0].roomId)"
              >入室</button>
            </li>

            <li class="list-group-item">
              <div class="row mx-auto">
                <template v-for="(member, j) in row">
                  <div style="width: 33%; text-align: center;" :key="j">
                    <img
                      :src="`img/${member.iconId}.png`"
                      width="30"
                      v-bind:style="{ background: get_constant.PNG[member.iconId] }"
                    />
                    <p style="font-size: 12px;">{{ member.userName }}</p>
                  </div>
                </template>
              </div>
            </li>
          </ul>
        </div>
        <br />
        <br />
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import * as _ from "lodash";

import { constant } from "~/constant";
import { i_responce } from "~/interface";
import { get_request, post_request, put_request } from "~/utils/request";
import { RoomStore } from "~/store";

export default {
  props: ["list"],
  computed: {
    get_constant: () => constant
  },
  methods: {
    // 入室
    async entering_room(roomId: string) {
      if (!confirm("入室しますか?")) {
        return;
      }

      this.display = false;
      const _res = await put_request(
        constant.EXPRESS_URL["/users/entering_room"],
        {
          roomId: roomId
        }
      );

      if (_res.status !== 200) {
        return;
      }

      const _ret: i_responce["/users/entering_room"] = await _res.json();

      if (_ret.STATUS === "2") {
        this.$router.push(constant.URL[2]);
      } else {
        location.reload();
      }
    }
  }
};
</script>