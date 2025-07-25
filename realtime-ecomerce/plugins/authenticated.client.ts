import { defineNuxtPlugin } from "nuxt/app";
import { showError } from "../utils/toast-notification";

export default defineNuxtPlugin({
    name: "authenticated",
    parallel: true,
    async setup(nuxtApp) {
    nuxtApp.provide("authenticated", (error: any) => {
        const statusCode = error.value?.statusCode;
        if (statusCode === 401) { 
            window.location.href = "/auth/signin";
            console.error(error);
            showError('Unauthenticated!')
        }
    });
  },
});