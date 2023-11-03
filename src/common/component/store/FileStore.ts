import { defineStore } from "pinia";
import { ref } from "vue";
import { FileBlobDTO } from "../dto/FileBlobDTO";

export const useFileStore = defineStore("useFileStore", () => {
  const fileBlobDTO = ref([] as FileBlobDTO[]);

  return {
    fileBlobDTO
  };
});
