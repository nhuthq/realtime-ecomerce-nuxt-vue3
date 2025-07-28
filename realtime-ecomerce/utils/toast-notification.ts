import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const toast = useToast();

export function errorMsg(message: string) {
  toast.error(message, {})
  // toast.error(message, {
    
  // });
}

export function successMsg(message: string) {
  toast.success(message, {
    position: "bottom-right",
    duration: 4000,
    dismissible: true,
  });
}
