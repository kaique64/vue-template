<template>
  <q-field
    v-model="modelValue"
    dense
    outlined
    :label="label"
    :autofocus="focus"
    class="q-mb-sm"
    :disable="disable"
    @update:model-value="updateModelValue"
  >
    <template #default>
      <Money3Component v-model="modelValue" :model-modifiers="{ number: true }" class="currency-input"
                       v-bind="config"></Money3Component>
    </template>
  </q-field>
</template>

<script setup lang="ts">
import { Money3Component } from 'v-money3';
import { ref, watch } from 'vue';
import { toUpperCase } from '../util/CheckText';

interface IProps {
  modelValue: number;
  label: string;
  isUpperCase: boolean;
  disable?: boolean;
  focus?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits();
const isUpperCase = ref(props.isUpperCase);
const focus = ref(props.focus);
const disable = ref(props.disable);

const modelValue = ref(props.modelValue);
const label = ref(props.label);
const config = ref({
  masked: false,
  prefix: '',
  suffix: '',
  thousands: '.',
  decimal: ',',
  precision: 2,
  disableNegative: false,
  disabled: false,
  min: null,
  max: null,
  allowBlank: false,
  minimumNumberOfCharacters: 0,
  shouldRound: true,
  focusOnRight: false
});

watch(modelValue, (newValue: string) => {
  emit('update:model', isUpperCase.value ? toUpperCase(newValue) : newValue);
});

const updateModelValue = (newValue: any) => {
  modelValue.value = isUpperCase.value ? toUpperCase(newValue) : newValue;
};
</script>

<style>
.currency-input {
  border: none;
  outline: none;
  width: 100%;
  margin-bottom: 1px;
}
</style>