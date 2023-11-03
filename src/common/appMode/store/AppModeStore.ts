import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUrlParameterService } from '../../service/UrlParameterService';

export const AppModeStore = defineStore('AppModeStore', () => {
  const showMenu = ref(true);

  const checkNoMenuParameter = function () {
    if (
      useUrlParameterService().getMenuParameterValue('show-menu') === 'false'
    ) {
      showMenu.value = false;
    }
  };

  return {
    showMenu,
    checkNoMenuParameter,
  };
});
