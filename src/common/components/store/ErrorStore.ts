import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { IErrors } from "../../../modules/upload/types/IErrors";

export const ErrorStore = defineStore("ErrorStore", () => {
  const errors = ref({}) as Ref<null | IErrors>;
  return {
    errors
  };
});
