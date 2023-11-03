import {defineStore} from "pinia";
import {Ref, ref} from "vue";
import {ICheckErrors} from "@/common/type/ICheckErrors";

export const CheckErrorsStore = defineStore("FileStore", () => {
    const checkErrors = ref() as Ref<ICheckErrors>;

    return {
        checkErrors
    };
});
