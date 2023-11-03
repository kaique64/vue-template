<template>
    <div class="row q-pa-md">
        <div class="col-12">
            <div class="q-pa-sm text-bosch">
                <div v-for="(item, index) in fieldValues" :key="index">
                    <InputField :model="item" :label="labelsList[0][index]" v-if="index !== 'tShirtSize'"/>
                    <InputSelect
                            @update:selected-value="onSelectedValueUpdate(index,labelsList[0][index])"
                            :selected-value="item"
                            :options="tshirtSizesOptions"
                            :label="labelsList[0][index]"
                            v-if="index === 'tShirtSize'"/>

                </div>
            </div>
        </div>
        <div class="col-12 q-pa-sm text-right">
            <Button
                    flat
                    button-id="btn-confirm-company-update"
                    button-size="md"
                    class="btn-primary q-mr-md"
                    :button-label="labelValue"
            />
            <Button
                    v-close-popup
                    button-id="btn-cancel-company-update"
                    button-size="md"
                    class="btn-secondary"
                    button-label="Cancel"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Button from "@/common/component/button/Button.vue";
import InputField from "@/common/component/input/InputField.vue";
import InputSelect from "@/common/component/input/InputSelect.vue";

interface IProps {
    fieldValues: any;
    labelValue: string;
}

const props = defineProps<IProps>();
const labelValue = ref(props.labelValue);
const fieldValue = ref(props.fieldValues);
const labelsList: CompanyDTO[] = [{
    code: "Company Code",
    name: "Company Name",
    systemId: "System Id",
    division: "Division",
    country: "Country",
    legalEntity: "Legal Entity",
    tShirtSize: "T-Shirt Size",
    targetSystem: "Target System"
}]

const onSelectedValueUpdate = (index, value) => {
    console.log(`Selected value for index ${index}: ${value}`)
}

const tshirtSizesOptions = [
    {
        label: "Small (S)",
        value: "S",
        description: "Small t-shirt size",
        category: '1'
    },
    {
        label: "Medium (M)",
        value: "M",
        description: "Medium t-shirt size",
        category: '1'
    },
    {
        label: "Large (L)",
        value: "L",
        description: "Large t-shirt size",
        category: '1'
    },
    {
        label: "Extra Large (XL)",
        value: "XL",
        description: "Extra Large t-shirt size",
        category: '1'
    }
];
</script>