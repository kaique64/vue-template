import { ErrorStore } from "../store/ErrorStore";

export const checkErrors = (value: any, messageObject: any) => {
  const errorsStore = ErrorStore();
  if (!value) {
    errorsStore.errors = messageObject;

    return {
      position: "top",
      message: "<b>" + messageObject?.message + "</b>",
      html: true,
      color: "red-5",
      actions: [
        {
          icon: "mdi-close-box",
          color: "white"
        }
      ],
      textColor: "white",
      type: "negative"
    };
  }
  errorsStore.errors = null;
};
