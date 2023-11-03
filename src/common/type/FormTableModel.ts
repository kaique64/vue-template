import {CompanyDTO} from "@/modules/project/dto/CompanyDTO";
import {ref, Ref} from "vue";

const company: Ref<CompanyDTO> = ref({
    code: {value: '', label: 'Company code', key: 'code', fieldType: 'input',},
    name: {value: '', label: 'Company name', key: 'name', fieldType: 'input',},
    systemId: {value: '', label: 'System ID', key: 'systemId', fieldType: 'input',},
    gbId: {value: '', label: 'GB', key: 'gbId', fieldType: 'input',},
});