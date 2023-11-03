<template>
  <DialogTemplate
      :title="title"
      width="26vw"
      height="25vh"
      :close-btn="true"
  >
    <template #content>
      <div class="row q-pa-md justify-end">
        <div class="col-12">
          <div class="row q-pa-sm text-bosch">
            <div class="font-regular-bosch font-16">Are you sure you want to delete {{ isPlural  ? 'these items' : 'this item' }}?</div>
          </div>
          <div class="col-12 q-pa-sm text-right">
            <Button
                flat
                button-id="btn-confirm-company-update"
                button-size="md"
                button-class="btn-primary q-mr-md"
                button-label="Delete"
                :button-loading="loading"
                @click="$emit('onDelete')"
            />
            <Button
                v-if="!loading"
                v-close-popup
                flat
                button-id="btn-cancel-company-delete"
                button-size="md"
                button-class="btn-secondary"
                button-label="Cancel"
            />
          </div>
        </div>
      </div>
    </template>
  </DialogTemplate>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import Button from '@/common/component/button/Button.vue';
import DialogTemplate from '@/common/component/dialog/DialogTemplate.vue';

interface IProps {
  loading: boolean;
  title: string;
  isPlural: boolean;
}

const props = defineProps<IProps>();
const loading = computed(() => props.loading);
const title = ref(props.title);
const isPlural = ref(props.isPlural);
defineEmits(['onDelete']);
</script>

<style>

</style>