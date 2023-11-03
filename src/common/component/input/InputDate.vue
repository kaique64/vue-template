<template>
  <q-input
      v-model="modelValue"
      :label="label"
      dense
      outlined
      readonly
      :disable="disabled"
      mask="date"
      @update:model-value="updateModelValue"
  >
    <template #append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date
              v-model="modelValue"
              minimal
              @update:model-value="updateModelValue"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close"/>
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

interface IProps {
  model: any;
  label: string | undefined;
  disabled: boolean;
}

const props = defineProps<IProps>();
const label = ref(props.label);
const disabled = ref(props.disabled);

const modelValue = ref(props.model !== null && props.model !== undefined && props.model.toString().replaceAll('-', '/'));

const emit = defineEmits();

watch(modelValue, (newValue) => {
  emit("update:model", newValue);
});

const updateModelValue = (newValue: any) => {
  modelValue.value = newValue;
};

</script>
