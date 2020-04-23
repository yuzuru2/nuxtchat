<style scoped></style>
<template>
  <div>
    <b-modal id="modal-1" title="部屋をつくる" ref="my-modal">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          placeholder="部屋名 20文字以内"
          aria-label
          aria-describedby="basic-addon1"
          maxlength="20"
          v-model="roomName"
        />
      </div>

      <br />

      <label>上限人数</label>
      <select class="custom-select" v-model="upper">
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5" selected>5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
      </select>

      <template v-slot:modal-footer="{}">
        <b-button class="yes_button" variant="success" @click="modal_ok">
          <strong>作成</strong>
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { constant } from "~/constant";
import { i_responce } from "~/interface";
import { get_request, post_request, put_request } from "~/utils/request";

export default {
  data() {
    return {
      roomName: "",
      upper: "5"
    };
  },
  methods: {
    async modal_ok() {
      if (this.roomName.length === 0) {
        alert("部屋名を入力してください");
        return;
      }

      this.display = false;
      const _res = await post_request(constant.EXPRESS_URL["/rooms/create"], {
        name: this.roomName,
        upper: Number(this.upper)
      });

      if (_res.status !== 200) {
        return;
      }

      const _ret: i_responce["/rooms/create"] = await _res.json();
      if (_ret.STATUS === "2") {
        this.$router.push(constant.URL[2]);
      }
    }
  }
};
</script>