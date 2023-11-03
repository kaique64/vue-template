import router from "../../router";

export const useUrlParameterService = () => {

  function getMenuParameterValue(parameter: string) {
    const params = new URLSearchParams(window.location.search);
    return params.get(parameter);
  }

  async function getAndRemoveMenuParameterValue(parameter: string) {
    const params = new URLSearchParams(window.location.search);
    const result = params.get(parameter);

    let search = "";
    let seperator = "";
    params.forEach((value, key) => {
      if (key !== parameter) {
        if (search.length === 0) {
          seperator = "?";
        } else {
          seperator = "&";
        }
        search = search + seperator + key + "=" + value;
      }
    });
    await router?.push(window.location.pathname + search);
    history.replaceState({ ...window.history.state }, "");

    return result;
  }


  return { getMenuParameterValue, getAndRemoveMenuParameterValue };

};