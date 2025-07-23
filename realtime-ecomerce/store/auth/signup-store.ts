import { ref } from "vue";
import { defineStore } from "pinia";

export const useSignUpStore = defineStore('signup-store', () => {
  const registerInput = ref({
    name:'',
    email: '',
    password: '',
    otpCode:''
  });
  
    return { registerInput }
  })