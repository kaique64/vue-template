export const useBase64Service = () => {
  function utf8ToB64(str: any) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  return {
    utf8ToB64
  };
};
