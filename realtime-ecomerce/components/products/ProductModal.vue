<script setup>

import { storeToRefs } from 'pinia';
import { ref, watchEffect } from 'vue';
import { useHeaders } from '../../utils/http-headers';
import { showError, successMsg } from '../../utils/toast-notification';
import { useProductsStore } from '../../stores/product/product-store';

import handleApiError from '../../utils/handle-parse-error';

const headers = useHeaders()
const props = defineProps(["isShow", "categories"])
const emits = defineEmits(["toggleProductModal", "refreshProducts"])    

const isLoading = ref(false)
const submitEnable = ref(false)
const productStore = useProductsStore()
const { productInput, edit, productColors } = storeToRefs(productStore)

watchEffect(() => {
  submitEnable.value = productInput.value.name.trim().length > 0 && 
  productInput.value.color.trim().length > 0 && 
  productInput.value.categoryId !== null
});

async function submitInput() {
    try {
        isLoading.value = true;
        const productEndpoint = edit.value ? 
        "/api/admin/product/update-product" :
        "/api/admin/product/create-product"

        const response = await $fetch(productEndpoint, {
            method: "POST",
            body: JSON.stringify(productInput.value),
            headers: {...headers}
        })
        
        console.log("SUBMIT PRODUCT RESPONSE: ", response)
        
        if (response.statusCode === 200) {
            
            isLoading.value = false;
            emits('refreshProducts')
            setTimeout(() => {
                emits('toggleProductModal')
            }, 500);
            
            successMsg(response.message)
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
  <BaseModal :isShow="isShow">
    <template #title>
      <h1 class="text-2xl font-bold">{{ edit ? "Edit" : "Create" }} product</h1>
    </template>

    <template #body>
        <BaseInput
          v-model="productInput.name"
          :type="'text'"
          :placeholder="'Product name'"/>

          <div class="relative w-full my-5">
            <select
              class="w-full appearance-none rounded-lg border border-gray-300 bg-white p-4 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              v-model="productInput.color"
            >
              <option disabled value="">Select a color</option>
              <option v-for="color in productColors" :key="color" :value="color">
                {{ color }}
              </option>
            </select>
            <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>

          <div class="relative w-full my-5">
            <select
              class="w-full appearance-none rounded-lg border border-gray-300 bg-white p-4 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              v-model="productInput.categoryId"
            >

              <option disabled value="">Seleect a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category?.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>
    </template>

    <template #footer>
      <BaseButton 
      class="bg-slate-400" 
      @click="emits('toggleProductModal')"
      label="Close"/>

      <BaseButton 
      :label="edit?'Update':'Create'"
      :isLoading="isLoading" 
      :disabled="!submitEnable"
      @click="submitInput" />
    </template>
  </BaseModal>
</template>