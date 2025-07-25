<script lang="ts" setup>
import VOtpInput from "vue3-otp-input";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useSignUpStore } from "../../stores/auth/signup-store";
import { showError, successMsg } from "../../utils/toast-notification";
import handleApiError from "../../utils/handle-parse-error";

const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);

const router = useRoute();
const bindModal = ref("");
const isLoading = ref(false);
const submitEnable = ref(false);
const signUpStore = useSignUpStore();
const { registerInput } = storeToRefs(signUpStore);

function handleOnComplete (value: string) {
  registerInput.value.otpCode = value;
  console.log("OTP completed: ", value);
};

function handleOnChange (value: string) {
  console.log("OTP changed: ", value);
  submitEnable.value = value.length === 6;
};

async function verifyEmail() {

  isLoading.value = true;
  try {
    const response = await $fetch("/api/auth/email-verification", {
      method: "POST",
      body: JSON.stringify(registerInput.value),
    });

    if (response.statusCode === 200) {
      isLoading.value = false;
      successMsg(response.message);
      setTimeout(() => {
        window.location.href='/auth/signin'
      }, 1000);
    }
  } catch (error) {
    console.log("ERROR: ", error)
    const { message } = handleApiError(error);
    showError(message)
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <div class="bg-white h-screen">
      <div class="h-full w-full flex justify-center items-center">
        <div class="flex flex-col gap-5">
          <h1 class="text-2xl mb-3 text-center font-medium">E-mail verification</h1>
          <v-otp-input
            ref="otpInput"
            input-classes="otp-input"
            :conditionalClass="['one', 'two', 'three', 'four']"
            separator=""
            inputType="letter-numeric"
            :num-inputs="6"
            v-model:value="bindModal"
            :should-auto-focus="true"
            :should-focus-order="true"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
            :placeholder="['*', '*', '*', '*']"
          />

          <BaseButton
            class="w-[100%] mt-5"
            @click="verifyEmail"
            :isLoading="isLoading"
            :disabled="!submitEnable"
            label="Verify your Email Adress"
          ></BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e4e4e4;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>
