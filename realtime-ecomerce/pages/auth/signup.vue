<script  setup>
import { useRoute } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useSignUpStore } from "../../store/auth/signup-store";
import { storeToRefs } from "pinia";
  
  definePageMeta({
      layout: 'auth'
  })

  const rules = {
    name: {required},
    email: {required, email},
    password: {required},
  }

  const signUpStore = useSignUpStore()
  const { registerInput }= storeToRefs(signUpStore)
  
  const router = useRoute();
  const isLoading = ref(false)
  const validate = useVuelidate(rules, registerInput);

</script>

<template>
  <div class="bg-white h-screen ">
    <div class="h-full w-full flex justify-center items-center">
      <div class=" w-[300px]">
        <div class="flex flex-col gap-5">
          <h1 class="text-2xl mb-3 text-center font-medium">Sign In</h1>

          <FormError :errors="validate.name.$errors">
            <BaseInput
              v-model="registerInput.name"
              type="text"
              placeholder="User Name"
            />
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

          <BaseButton class="mt-5" :isLoading="isLoading" label="Sign In"/>
          <p class="text-sm font-normal text-center text-gray-700 dark:text-gray-500 sm:text-start" >
            Already have an account?
            <NuxtLink to="/auth/signin" class="text-indigo-500 hover:text-brand-600 font-semibold">Sign In</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

  
  