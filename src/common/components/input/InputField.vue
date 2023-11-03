<template>
  <q-input
    v-model="modelValue"
    dense
    outlined
    :disable="disable"
    :label="label"
    type="text"
    @update:model-value="updateModelValue"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { toUpperCase } from '@/common/components/util/CheckText';
import { capitalizeText } from '../util/CapitalizeText';

interface IProps {
  model: any;
  label: string | undefined;
  disable?: boolean;
  isUpperCase: boolean;
  isCapitalize?: boolean;
}

const props = defineProps<IProps>();
const modelValue = ref(props.model);
const label = ref(props.label);
const isUpperCase = ref(props.isUpperCase);
const isCapitalize = ref(props.isCapitalize);
const disable = ref(props.disable);
const emit = defineEmits();

/**
 * This method is responsible to format the input value
 * @param inputValue value get from input component
 * @returns the input value formatted
 */
function formatInputValue(inputValue: string) {
  if (isUpperCase.value) {
    return toUpperCase(inputValue);
  }

  if (isCapitalize.value) {
    return capitalizeText(inputValue);
  }

  return inputValue;
}

watch(modelValue, (newValue: string) => {
  emit('update:model', formatInputValue(newValue));
});

const updateModelValue = (newValue: any) => {
  modelValue.value = formatInputValue(newValue);
};
</script>
