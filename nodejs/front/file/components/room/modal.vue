<style scoped></style>
<template>
  <!-- Modal -->
  <b-modal id="modal-1" title="詳細">
    <ul class="list-group">
      <li class="list-group-item">
        {{ get_roomName }}
        <br />
        ({{ get_count }}/{{ get_upper }})
        <br />
        ホスト: {{ get_hostName }}
      </li>
    </ul>

    <br />

    <!-- ホストのみ -->
    <div v-if="get_host_flag">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          placeholder="部屋名"
          aria-label
          aria-describedby="basic-addon1"
          maxlength="20"
          v-model="roomName"
        />
        <div class="input-group-append">
          <button
            class="btn btn-success"
            type="button"
            @click="update_room_name"
          >
            変更
          </button>
        </div>
      </div>

      <br />

      <select
        class="custom-select"
        v-model="select_value"
        @change="update_upper"
      >
        <template v-for="i of 14">
          <option v-if="i + 1 === get_upper" :value="i + 1" selected :key="i">{{
            i + 1
          }}</option>
          <option v-else :value="i + 1" :key="i">{{ i + 1 }}</option>
        </template>
      </select>
    </div>

    <br />
    <br />

    <!-- 詳細 -->
    <template v-for="(row, i) in get_room_list">
      <div v-if="row.userId !== get_myId" class="card" :key="i">
        <ul class="list-group list-group-flush">
          <li class="list-group-item" style="background-color: #eee;">
            <div style="text-align: center;">
              <img
                :src="`img/${row.iconId}.png`"
                width="50"
                v-bind:style="{ background: get_constant.PNG[row.iconId] }"
              />
            </div>
          </li>
          <li class="list-group-item" style="background-color: #eee;">
            {{ row.userName }}
          </li>
          <li
            v-if="get_host_flag"
            class="list-group-item"
            style="background-color: #eee;"
          >
            <button
              type="button"
              class="btn btn-warning"
              @click="update_hostId(row.userId, row.userName)"
            >
              権限移譲
            </button>
            <button
              type="button"
              class="btn btn-danger"
              style="float: right;"
              @click="exile(row.userId, row.userName)"
            >
              追放
            </button>
          </li>
        </ul>

        <br />
      </div>
    </template>

    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="light" @click="cancel()">閉じる</b-button>
    </template>
  </b-modal>
</template>
<script lang="ts">
import moment from 'moment';
import { constant } from '~/constant';
import { i_responce } from '~/interface';
import { get_request, post_request, put_request } from '~/utils/request';
import { RoomStore } from '~/store';
import { socket_init, socket_disconnect } from '~/socketio';
export default {
  data() {
    return {
      select_value:
        RoomStore.room_list.length !== 0 ? RoomStore.room_list[0].upper : 0,
      roomName:
        RoomStore.room_list.length !== 0 ? RoomStore.room_list[0].roomName : '',
    };
  },

  computed: {
    get_constant: () => {
      return constant;
    },

    get_room_list: () => {
      return RoomStore.room_list;
    },
    get_myId: () => {
      return RoomStore.userId;
    },
    get_roomName: () => {
      return RoomStore.room_list.length !== 0
        ? RoomStore.room_list[0].roomName
        : '';
    },
    get_upper: () => {
      return RoomStore.room_list.length !== 0
        ? RoomStore.room_list[0].upper
        : 0;
    },
    get_count: () => {
      return RoomStore.room_list.length;
    },
    get_hostName: () => {
      const _ret = RoomStore.room_list.filter((m) => m.hostId === m.userId);
      return _ret.length !== 0 ? _ret[0].userName : '';
    },
    get_host_flag: () => {
      const _ret = RoomStore.room_list.filter(
        (m) => m.hostId === RoomStore.userId
      );

      if (_ret.length === 0) {
        return false;
      }

      return true;
    },
  },
  methods: {
    async update_upper() {
      await put_request(constant.EXPRESS_URL['/rooms/update_upper'], {
        upper: Number(this.select_value),
      });
    },

    async update_room_name() {
      const _roomName = this.roomName.trim();
      if (_roomName.length === 0) {
        alert('未入力です');
        return;
      }

      await put_request(constant.EXPRESS_URL['/rooms/update_roomName'], {
        roomName: this.roomName,
      });
    },

    async update_hostId(userId: string, name: string) {
      if (!confirm(`${name}さんに権限を移譲しますか？`)) {
        return;
      }

      await put_request(constant.EXPRESS_URL['/rooms/update_hostId'], {
        hostId: userId,
      });
    },

    async exile(userId: string, name: string) {
      if (!confirm(`${name}さんを追放しますか？`)) {
        return;
      }

      await post_request(constant.EXPRESS_URL['/room_blacklists/create'], {
        targetId: userId,
      });
    },
  },
};
</script>
