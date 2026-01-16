import { errorMsg } from "./toast-notification";

export function showLoginOrSignUpError(error: any) {
  const errors = error?.data?.data?.fieldErrors;
  if (typeof error?.data?.message !== "undefined") {
    errorMsg(error?.data?.message);
  }

  for (const inputFieldName in errors) {
    for (const inputErrorMessage of errors[inputFieldName]) {
      errorMsg(inputErrorMessage);
    }
  }
}
