import { useHeaders } from "../utils/http-headers";
import { defineNuxtRouteMiddleware, useFetch, useNuxtApp } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => { 

    const headers = useHeaders()
    const { $isAuthenticated } = useNuxtApp()

    try {

        const toAdminLayout = to?.meta?.layout
        const fromAdminLayout = from?.meta?.layout

        if (fromAdminLayout === 'admin' || toAdminLayout === 'admin') {
            const { data, error: authenticatedError } = await useFetch("/api/auth/modules/authenticated", {
                headers: { ...headers}
            });
             $isAuthenticated(authenticatedError) as any
        }
    } catch (error: any) {
        console.log(error?.message)
    }
});