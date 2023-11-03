<template>
  <div class="row q-pa-xs">
    <div class="col-12">
      <q-form
        :class="inRow ? 'row q-pa-sm text-bosch' : 'q-pa-sm text-bosch'"
        @keyup.enter="$emit('enterKeypress')"
        @submit="$emit('submitAction')"
      >
        <div
          v-for="(item, index) in fieldValues"
          :key="index"
          :class="inRow ? 'col-3 q-pa-xs' : 'q-pa-xs'"
        >
          <div v-if="item !== undefined">
            <InputField
              v-if="item.fieldType === 'input:filter'"
              :is-upper-case="item.isUpperCase"
              :is-capitalize="item.isCapitalize"
              :disable="item?.disabled"
              :model="item.value"
              :mask="item.mask"
              :maxlength="item.maxLength"
              :label="item.label"
              :rules="
                item.rules
                  ? [
                      (val) =>
                        (val && val.length > 0) || 'Please type something',
                      ...item.rules,
                    ]
                  : item.required && [
                      (val) =>
                        (val && val.length > 0) || 'Please type something',
                    ]
              "
              hide-bottom-space
              @update:model-value="
                (value) => {
                  item.onChange && item.onChange(value);
                }
              "
              @blur="item.onBlur"
            />
            <InputField
              v-if="item.fieldType === 'input'"
              :is-upper-case="item.isUpperCase"
              :is-capitalize="item.isCapitalize"
              :disable="item?.disabled"
              :model="item.value"
              :mask="item.mask"
              :maxlength="item.maxLength"
              :label="item.label"
              :rules="
                item.rules
                  ? [
                      (val) =>
                        (val && val.length > 0) || 'Please type something',
                      ...item.rules,
                    ]
                  : item.required && [
                      (val) =>
                        (val && val.length > 0) || 'Please type something',
                    ]
              "
              hide-bottom-space
              @update:model="item.value = $event"
            />
            <InputField
              v-if="item.fieldType === 'input:number'"
              type="number"
              :is-upper-case="item.isUpperCase"
              :is-capitalize="item.isCapitalize"
              :disable="item?.disabled"
              :model="item.value"
              min="0"
              :mask="item.mask"
              :label="item.label"
              lazy-rules
              :hint="item.hint"
              :rules="
                item.rules
                  ? [
                      (val) => (val && val > 0) || 'Please type something',
                      ...item.rules,
                    ]
                  : item.required && [
                      (val) => (val && val > 0) || 'Please type something',
                    ]
              "
              hide-bottom-space
              @update:model="updateValue(item, $event)"
            />
            <InputCurrency
              v-if="item.fieldType === 'input:currency'"
              :disable="item?.disabled"
              :model-value="item.value"
              min="0"
              :label="item.label"
              :is-upper-case="false"
              lazy-rules
              :rules="
                item.rules
                  ? [
                      (val) => (val && val > 0) || 'Please type something',
                      ...item.rules,
                    ]
                  : item.required && [
                      (val) => (val && val > 0) || 'Please type something',
                    ]
              "
              hide-bottom-space
              @update:model="updateValue(item, $event)"
            />
            <InputSelect
              v-if="item.fieldType === 'select' && inRow"
              :disable="item?.disabled"
              :selected-value="item.value"
              :clearable="item.clearable"
              :options="item.options"
              :label="item.label"
              :rules="
                item.rules
                  ? [
                      (val) => val !== null || 'Please select a option',
                      ...item.rules,
                    ]
                  : item.required && [
                      (val) => val !== null || 'Please select a option',
                    ]
              "
              hide-bottom-space
              @update:modelValue="item.value = $event"
            />
            <InputSelect
              v-if="item.fieldType === 'select' && !inRow"
              :disable="item?.disabled"
              :selected-value="item.value"
              :options="item.options"
              :label="item.label"
              :rules="
                item.rules
                  ? [
                      (val) => val !== null || 'Please select a option',
                      ...item.rules,
                    ]
                  : item.required && [
                      (val) => val !== null || 'Please select a option',
                    ]
              "
              hide-bottom-space
              @update:modelValue="item.value = $event"
            />
            <q-select
              v-if="item.fieldType === 'dropdown'"
              v-model="item.value"
              :disable="item?.disabled"
              :options="item.options"
              use-input
              outlined
              lazy-rules
              :label="item.label"
              dense
              :rules="
                item.rules
                  ? [
                      (val) => val !== null || 'Please select a option',
                      ...item.rules,
                    ]
                  : item.required && [
                      (val) => val !== null || 'Please select a option',
                    ]
              "
              :loading="item.loading"
              hide-bottom-space
              @virtual-scroll="
                (event) => {
                  item.onScroll && item.onScroll(event);
                }
              "
              @filter="
                (value, update, _) => {
                  dropdownFilterFunction(value, update, item);
                }
              "
              @update:model-value="
                (value) => {
                  item.onChange && item.onChange(value);
                }
              "
              @blur="item.onBlur"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">No results</q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              v-if="item.fieldType === 'select:multiple'"
              ref="multipleSelect"
              v-model="item.value"
              :disable="item?.disabled"
              :options="item.options"
              :multiple="item.fieldType === 'select:multiple'"
              :use-chips="item.fieldType === 'select:multiple'"
              use-input
              outlined
              lazy-rules
              :label="item.label"
              style="display: grid"
              dense
              :rules="
                item.rules
                  ? [
                      (val) => val !== null || 'Please select a option',
                      ...item.rules,
                    ]
                  : item.required && [
                      (val) => val !== null || 'Please select a option',
                    ]
              "
              :loading="item.loading"
              hide-bottom-space
              @filter="
                (value, update, abort) => {
                  filterFunction(value, update, abort, item);
                }
              "
              @update:model-value="
                (value) => {
                  item.onChange && item.onChange(value);
                }
              "
              @blur="item.onBlur"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">No results</q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              v-if="item.fieldType === 'input:date'"
              v-model="item.value"
              :label="item.label"
              dense
              outlined
              readonly
              :disable="item?.disabled"
              mask="date"
              @update:model-value="
                (value) => {
                  item.onChange && item.onChange(value);
                }
              "
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-close-popup="dateClosePopup"
                      @navigation="dateClosePopup = false"
                      v-model="item.value"
                      minimal
                      @input="this.$refs.popupProxy.hide()"
                      @update:model-value="
                        (value) => {
                          item.onChange && item.onChange(value);
                        }
                      "
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <slot name="content"></slot>
      </q-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import InputField from '@/common/component/input/InputField.vue';
import InputSelect from '@/common/component/input/InputSelect.vue';
import InputCurrency from '@/common/component/input/InputCurrency.vue';
import { TFieldValue } from '../../types/TFieldValue';

defineEmits(['enterKeypress', 'submitAction']);

interface IProps {
  fieldValues: TFieldValue;
  btnPrimaryLabelValue?: string;
  btnSecondaryLabelValue?: string;
  loading?: boolean;
  inRow?: boolean;
}
const dateClosePopup = ref(true);
const props = defineProps<IProps>();
const fieldValues = computed(() => props.fieldValues);
const validated = ref(false);
const updateValue = (item: TFieldValue, value: any) => {
  if (item.fieldType === 'input:number' && value < 0) {
    validated.value = true;
    return;
  } else {
    validated.value = false;
  }

  item.value = value;
};

async function dropdownFilterFunction(value, update, item) {
  setTimeout(() => {
    update(() => {
      if (item.dropdownOnInput) {
        item.dropdownOnInput(value, item.key);
      } else {
        handleInputSelect(value, item.key);
      }
    });
  }, 3000);
}

async function filterFunction(value, update, _, item) {
  setTimeout(() => {
    update(() => {
      handleInputSelect(value, item.key);
      item.dropdownOnInput && item.dropdownOnInput(value, item.key);
    });
  }, 1500);
}

// Handle select input
function handleInputSelect(event, itemKey) {
  const value =
    typeof event === 'string'
      ? event.toLowerCase()
      : event.target.value.toLowerCase();
  const options = [...fieldValues.value[itemKey].options];

  if (value !== '') {
    // Filter the raw array
    let filteredOptions = options.filter((option) => {
      return option.label.toString().toLowerCase().includes(value);
    });

    fieldValues.value[itemKey].options = filteredOptions;
  }
}
</script>

<style lang="scss">
.q-field--outlined .q-field__control {
  border-radius: 10px !important;
  padding: 0 15px;
  background: $bosch-white;
}

.q-menu {
  max-height: 200px; /* Adjust the value as needed */
}
</style>
