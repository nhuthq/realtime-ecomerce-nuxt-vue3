import { defineNuxtPlugin, useCookie } from "nuxt/app";
import { userCookieSettings } from './../utils/user-cookie-settings';

export default defineNuxtPlugin({
    name: "logout",
    parallel: true,
    async setup(nuxtApp) {
    nuxtApp.provide("logout", (error: any) => {
        const userCookie = useCookie("user", userCookieSettings);
        userCookie.value = null;
        window.location.href = "/auth/signin";
    });
  },
});