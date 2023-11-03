<template>
  <q-expansion-item
    :icon="icon"
    :label="label"
    :group="group"
    :expand-separator="separator"
  >
    <div class="row">
      <slot name="content"></slot>
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface IProps {
  label: string;
  icon?: string;
  group?: string;
  separator?: boolean;
}

const props = defineProps<IProps>();
const label = ref(props.label);
const icon = ref(props.icon);
const group = ref(props.group);
const separator = ref(props.separator);
</script>

<style lang="scss">
.q-expansion-item,
.q-item-type,
.q-expansion-item--collapsed,
.q-expansion-item--standard {
  border-radius: 10px;
}
</style>
