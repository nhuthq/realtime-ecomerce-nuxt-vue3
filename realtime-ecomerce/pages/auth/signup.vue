<script setup>
import { storeToRefs } from "pinia";
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { showError } from "../../utils/toast-notification";
import handleApiError from "../../utils/handle-parse-error";
import { useSignUpStore } from "../../stores/auth/signup-store";

definePageMeta({
  layout: "auth",
});

const rules = {
  name: { required },
  email: { required, email },
  password: { required },
};

const router = useRouter();
const isLoading = ref(false);
const submitEnable = ref(false);
const signUpStore = useSignUpStore();
const { registerInput } = storeToRefs(signUpStore);
const validate = useVuelidate(rules, registerInput);

watchEffect(() => {
  submitEnable.value =
    registerInput.value.name.trim().length > 0 &&
    registerInput.value.email.trim().length > 0 &&
    registerInput.value.password.trim().length > 0;
});

async function submitSignUp() {
  const isValid = validate.value.$validate();
  if (!isValid) {
    console.log("Invalid Input");
    return;
  }
  isLoading.value = true;
  try {
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(registerInput.value),
    });

    if (response.statusCode === 200) {
      isLoading.value = false;
      successMsg(response.message);
      setTimeout(() => {
        router.push("/auth/email-verification");
      }, 1000);
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

          <FormError :errors="validate.name.$errors">
            <BaseInput v-model="registerInput.name" type="text" placeholder="User Name" />
          </FormError>

          <FormError :errors="validate.email.$errors">
            <BaseInput
              v-model="registerInput.email"
              type="email"
              :placeholder="'info@gmail.com'"
            />
          </FormError>

          <FormError :errors="validate.password.$errors">
            <BaseInput
              v-model="registerInput.password"
              :type="'password'"
              :placeholder="'Password'"
            />
          </FormError>

          <BaseButton
            class="mt-5"
            label="Sign Up"
            :disabled="!submitEnable"
            :isLoading="isLoading"
            @click="submitSignUp"
          />
          <p
            class="text-sm font-normal text-center text-gray-700 dark:text-gray-500 sm:text-start"
          >
            Already have an account?
            <NuxtLink
              to="/auth/signin"
              class="text-indigo-500 hover:text-brand-600 font-semibold"
              >Sign In</NuxtLink
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
