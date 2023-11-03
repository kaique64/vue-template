export const useScrollService = () => {
  function setHeightToParentHeight(htmlElement: HTMLElement | undefined) {
    if (htmlElement) {
      const parent = htmlElement.parentElement;
      if (parent) {
        htmlElement.style.height = parent.clientHeight + "px";
      }
    }
  }

  return { setHeightToParentHeight };
};
