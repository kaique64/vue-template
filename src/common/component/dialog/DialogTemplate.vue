<template>
  <q-layout view="lHh Lpr lFf" container :style="style" class="font-regular-bosch" style="border-radius: 10px">
    <q-header v-if="props.title">
      <q-toolbar class="font-bold-bosch bg-white primary-bosch">
        <q-toolbar-title class="ellipsis margin-12-12">{{ props.title }}</q-toolbar-title>
        <slot name="toolbarActions"></slot>
        <Button
            v-if="closeBtn"
            v-close-popup
            class="font-regular-bosch btn-secondary"
            button-id="btn-close-dialog"
            style="width: 36px; height: 10px"
            button-size="md"
            button-icon="mdi-close"
            @click="props.clickClose"
        >
        </Button>
      </q-toolbar>
      <q-separator style="background-color: #e0e0e0"/>
    </q-header>

    <q-page-container class="bg-white" style="border-radius: 10px">
      <q-page class="row">
        <div class="col-12">
          <slot name="content"></slot>
        </div>
      </q-page>
    </q-page-container>

    <q-inner-loading
        :showing="isLoading"
        label="$t('pleaseWait')"
        label-style="font-size: 1em; opacity: 1"
    />
  </q-layout>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import Button from "../button/Button.vue";

const props = defineProps<{
  title?: string;
  closeBtn?: boolean;
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

const closeBtn = ref(props.closeBtn);

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

.q-page {
  min-height: 100% !important;
}
</style>
