import { defineStore } from "pinia";
import { ref } from "vue";

export const FileStore = defineStore("FileStore", () => {
  const file = ref("");
  const fileEncoded = ref("");
  const loading = ref(false);
  const appKey = ref();

  return {
    file,
    fileEncoded,
    loading,
    appKey
  };
});
