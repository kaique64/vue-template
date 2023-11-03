<template>
    <q-select
        v-model="selectedValue"
        :options="options"
        :disable="disable"
        dense
        outlined
        options-dense
        :label="label"
        :clearable="clearable"
        @update:model-value="updateModelValue"
    >
        <template #no-option>
            <q-item>
                <q-item-section style="border-radius: 10px" class="text-grey">No Results</q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

interface IProps {
    selectedValue: any;
    options: any[];
    disable?: boolean;
    clearable?: boolean;
    label: string | undefined;
}

const props = defineProps<IProps>();
const selectedValue = ref(props.selectedValue);
const options = ref(props.options);
const label = ref(props.label);
const disable = ref(props.disable);
const clearable = ref(props.clearable);

const emit = defineEmits();

watch(selectedValue, (newValue) => {
  emit("update:model", newValue);
});

const updateModelValue = (newValue: any) => {
  selectedValue.value = newValue;
};
</script>
