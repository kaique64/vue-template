<template>
  <q-layout view="lHh lpr lFf" container :style="style" class="font-regular-bosch">
    <q-page-container class="bg-white fixed-center width-100 border">
      <q-header v-if="props.title" class="border-top">
        <q-toolbar class="font-bold-bosch bg-white primary-bosch border-top">
          <q-toolbar-title class="ellipsis margin-12-12">{{ props.title }}</q-toolbar-title>
          <slot name="toolbarActions"></slot>
          <Button
            v-close-popup="closePopup !== 0"
            class="font-regular-bosch"
            button-id="btn-close-dialog"
            style="margin-right: 5px"
            flat
            dense
            button-icon="mdi-close"
            @click="props.clickClose"
          >
          </Button>
        </q-toolbar>
        <q-separator style="background-color: #e0e0e0" />
      </q-header>
      <q-page class="row q-pa-md border-bottom" style="min-height: fit-content;">
        <div class="col-12">
          <slot name="content"></slot>
        </div>
        <q-page-scroller
          style="width: max-content"
          position="bottom-right"
          :scroll-offset="150"
          :offset="[18, 18]"
        >
          <q-btn v-if="showFloatButton" fab icon="keyboard_arrow_up" color="primary" />
        </q-page-scroller>
      </q-page>
    </q-page-container>

    <q-inner-loading
      :showing="isLoading"
      label-style="font-size: 1em; opacity: 1"
    />
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Button from "../button/Button.vue";

const props = defineProps<{
  title?: string;
  tooltip?: string;
  width?: string;
  scroll?: string;
  height?: string;
  isLoading?: boolean;
  icon?: string;
  disableButton?: boolean;
  clickClose?: (e: any) => void;
  closePopup?: number;
  disableFloatButton?: boolean;
}>();
const showFloatButton = computed(() => {
  return !props.disableFloatButton;
});

const style = computed(() => {
  const heightString = props.height !== undefined ? "height:" + props.height + ";" : "";
  const widthString = props.width !== undefined ? "width:" + props.width + ";" : "";
  const scroll = props.scroll !== undefined ? "overflow:" + props.scroll + ";" : "";
  return heightString + widthString + "max-width:100%;";
});
</script>

<style>
.ellipsis {
  text-overflow: ellipsis;
  white-space: unset;
  overflow: hidden;
}

.q-dialog__backdrop {
  backdrop-filter: blur(1px);
}

#btn-close-dialog:hover {
  background-color: #d1e4ff;
}

.border {
  border-radius: 10px;
}

.border-top {
  border-radius: 10px 10px 0 0;
}

.border-bottom {
  border-radius: 0 0 10px 10px;
}
</style>
