<template>
  <div :class="props.size.className">
    <q-card class="font-bold-bosch bordered height-100 min-height-panel">
      <q-toolbar class="primary-bosch">
        <q-toolbar-title class="margin-12-12 no-padding">
          <slot name="title"></slot>
        </q-toolbar-title>
        <q-space v-if="$slots.toolbarActions" />
        <slot name="toolbarActions"></slot>
      </q-toolbar>

      <q-separator />

      <slot name="content"></slot>

      <slot name="footer"></slot>

      <q-inner-loading
        :showing="props.isLoading"
        label="Updating data. Please wait..."
        label-style="font-size: 1em; opacity: 1"
      >
        <q-spinner :thickness="10" size="lg" color="blue" />
      </q-inner-loading>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { PanelSizeEnum } from "../type/PanelSizeEnum";

const props = defineProps<{
  isLoading: boolean;
  size: PanelSizeEnum;
}>();
</script>

<style lang="sass" scoped>
.my-class
  padding: 15px 15px

.min-height-panel
  min-height: 120px !important

.ellipsis
  text-overflow: unset
  white-space: normal
  overflow: hidden
  flex: unset
</style>
