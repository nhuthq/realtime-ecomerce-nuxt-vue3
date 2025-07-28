<script setup>
import { watchEffect } from "vue";
import { useCookie } from "nuxt/app";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { showError } from "../../utils/toast-notification";
import handleApiError from "../../utils/handle-parse-error";

definePageMeta({
  layout: "auth",
});
const loginInput = ref({
  email: "",
  password: "",
});

const rules = {
  email: { required, email },
  password: { required },
};

const router = useRouter();
const isLoading = ref(false);
const submitEnable = ref(false);
const validate = useVuelidate(rules, loginInput);
const userCookie = useCookie("user", userCookieSettings);

watchEffect(() => {
  submitEnable.value =
    loginInput.value.email.trim().length > 0 &&
    loginInput.value.password.trim().length > 0;
});

async function submitSignIn() {
  const isValid = validate.value.$validate();
  if (!isValid) {
    console.log("Invalid Input");
    return;
  }
  isLoading.value = true;
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(loginInput.value),
    });

    if (response.statusCode === 200) {
      isLoading.value = false;

      const userRole = response?.data?.user?.role;
      userCookie.value = response;
      console.log("LOGIN RESPONSE: ", JSON.stringify(response));

      switch (userRole) {
        case "CUSTOMER":
          router.push("/");
          break;
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        default:
          router.push("/");
          break;
      }
    }
  } catch (error) {
    console.log("ERROR: ", error);
    const { message } = handleApiError(error);
    showError(message);
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="bg-white h-screen">
    <div class="h-full w-full flex justify-center items-center">
      <div class="w-[300px]">
        <div class="flex flex-col gap-5">
          <h1 class="text-2xl mb-3 text-center font-medium">Sign In</h1>

          <FormError :errors="validate.email.$errors">
            <BaseInput
              v-model="loginInput.email"
              type="email"
              placeholder="Email"
            />
          </FormError>

          <FormError :errors="validate.password.$errors">
            <BaseInput
              v-model="loginInput.password"
              :type="'password'"
              :placeholder="'Password'"
            />
          </FormError>

          <BaseButton
            class="mt-5"
            label="Sign In"
            @click="submitSignIn"
            :isLoading="isLoading"
            :disabled="!submitEnable"
          />
          <p
            class="text-sm font-normal text-center text-gray-700 dark:text-gray-500 sm:text-start"
          >
            Dont have an account ?
            <NuxtLink
              to="/auth/signup"
              class="text-indigo-500 hover:text-brand-600 font-semibold"
              >Sign Up</NuxtLink
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
