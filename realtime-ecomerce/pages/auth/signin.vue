<script setup>
import { useRoute } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useCookie } from "nuxt/app";


definePageMeta({
      layout: 'auth'
  })
const loginInput = ref({
  email: "",
  password: "",
});

const rules = {
  email: { required, email },
  password: { required },
};

const isLoading = ref(false);
const router = useRoute();
const v$ = useVuelidate(rules, loginInput);
  
</script>

<template>
    <div class="bg-white h-screen ">
      <div class="h-full w-full flex justify-center items-center">
        <div class="w-[300px]">
          <div class="flex flex-col gap-5">
            <h1 class="text-2xl mb-3 text-center font-medium">Sign In</h1>

            <FormError :errors="v$.email.$errors">
              <BaseInput
                v-model="loginInput.email"
                type="email"
                placeholder="Email"
              />
            </FormError>

            <FormError :errors="v$.password.$errors">
              <BaseInput
                v-model="loginInput.password"
                :type="'password'"
                :placeholder="'Password'"
              />
            </FormError>

            <BaseButton class="mt-5" :isLoading="isLoading" label="Sign In"/>
            <p class="text-sm font-normal text-center text-gray-700 dark:text-gray-500 sm:text-start" >
              Dont have an account ?
              <NuxtLink to="/auth/signup" class="text-indigo-500 hover:text-brand-600 font-semibold">Sign Up</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
</template>
  
  