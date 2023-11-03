<template>
  <section class="row justify-between section-bg q-ma-xs q-my-md" style="border-radius: 10px">
    <div class="col-12 section-bg q-pa-md" style="border-radius: 10px">
      <div class="row justify-between">
        <div class="col-9 text-left">
          <p class="font-16 font-bold-bosch">{{ title }}</p>
        </div>
        <div class="col-2 text-right">
          <slot name="actions"></slot>
        </div>
      </div>
      <div class="row justify-center">
        <slot name="content"></slot>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">

import {ref} from "vue";

interface IProps {
  title: string;
}

const props = defineProps<IProps>();

const title = ref(props.title);
</script>