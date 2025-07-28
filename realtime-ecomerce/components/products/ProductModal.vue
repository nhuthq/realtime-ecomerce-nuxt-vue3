<script setup>
import { storeToRefs } from "pinia";
import { ref, watchEffect } from "vue";
import { useHeaders } from "../../utils/http-headers";
import { showError, successMsg } from "../../utils/toast-notification";
import { useProductsStore } from "../../stores/product/product-store";

import handleApiError from "../../utils/handle-parse-error";

const headers = useHeaders();
const props = defineProps(["isShow", "categories"]);
const emits = defineEmits(["toggleProductModal", "refreshProducts"]);

const isLoading = ref(false);
const submitEnable = ref(false);
const productStore = useProductsStore();
const { productInput, edit, productColors } = storeToRefs(productStore);

watchEffect(() => {
  submitEnable.value =
    productInput.value.price > 0 &&
    productInput.value.name.trim().length > 0 &&
    productInput.value.color.trim().length > 0 &&
    productInput.value.categoryId !== null;
});

async function submitInput() {
  try {
    isLoading.value = true;
    const { price, ...othersInput } = productInput.value;
    const productEndpoint = edit.value
      ? "/api/admin/product/update"
      : "/api/admin/product/create";

    console.log("BODY: ", JSON.stringify(productInput.value));

    const response = await $fetch(productEndpoint, {
      method: "POST",
      body: JSON.stringify({ price: parseFloat(price), ...othersInput }),
      headers: { ...headers },
    });

    console.log("SUBMIT PRODUCT RESPONSE: ", response);

    if (response.statusCode === 200) {
      edit.value = false;
      productInput.value = {};
      isLoading.value = false;

      emits("refreshProducts");
      setTimeout(() => {
        emits("toggleProductModal");
      }, 500);

      successMsg(response.message);
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
  <BaseModal :isShow="isShow">
    <template #title>
      <h1 class="text-2xl font-bold">{{ edit ? "Edit" : "Create" }} product</h1>
    </template>

    <template #body>
      {{ productInput }}
      <BaseInput
        v-model="productInput.name"
        :type="'text'"
        :placeholder="'Product name'"
        class="text-base font-medium"
      />

      <BaseInput
        class="mt-5"
        v-model="productInput.price"
        :type="'text'"
        :min="1"
        maxlength="5"
        step="0.01"
        :placeholder="'Price (in USD)'"
      />

      <div class="relative w-full my-5">
        <select
          class="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          v-model="productInput.color"
        >
          <option disabled value="">Select a color</option>
          <option v-for="color in productColors" :key="color" :value="color">
            {{ color }}
          </option>
        </select>
      </div>

      <div class="relative w-full my-5">
        <select
          class="w-full rounded-lg border border-gray-300 bg-white p-4 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          v-model="productInput.categoryId"
        >
          <option disabled value="">Seleect a category</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category?.name }}
          </option>
        </select>
      </div>
    </template>

    <template #footer>
      <BaseButton
        class="bg-slate-400"
        @click="emits('toggleProductModal')"
        label="Close"
      />

      <BaseButton
        :label="edit ? 'Update' : 'Create'"
        :isLoading="isLoading"
        :disabled="!submitEnable"
        @click="submitInput"
      />
    </template>
  </BaseModal>
</template>
