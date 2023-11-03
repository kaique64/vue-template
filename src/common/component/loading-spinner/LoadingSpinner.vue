<template>
  <div v-if="show" class="fullscreen background-spinner">
    <div class="loader"></div>
  </div>
</template>

<script setup lang="ts">

import { computed } from "vue";
import { UserStore } from "@/modules/user/store/UserStore";

const userStore = UserStore();

const show = computed(() => {
  return !userStore.userList || userStore.showSpinner;
});
</script>