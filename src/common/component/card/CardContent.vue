<template>
  <q-card v-if="clickable" :class="similar ? 'q-my-xs cursor-pointer q-hoverable q-custom-rounded-border': 'q-my-sm cursor-pointer q-hoverable q-custom-rounded-border'">
    <span class="q-focus-helper"></span>
    <q-card-section :class="withMargin ? 'q-custom-card row justify-between font-12' : 'q-custom-card-similiar'">
      <slot name="content"></slot>
    </q-card-section>
  </q-card>
  <q-card v-else flat class="q-custom-rounded-border q-my-sm">
    <span class="q-focus-helper"></span>
    <q-card-section :class="withMargin ? 'q-custom-card row justify-between font-12' : ''">
      <slot name="content"></slot>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface IProps {
  withMargin: boolean;
  clickable: boolean;
  similar?: boolean;
}

const props = defineProps<IProps>()
const withMargin = ref(props.withMargin);
const clickable = ref(props.clickable);
const similar = ref(props.similar);
</script>