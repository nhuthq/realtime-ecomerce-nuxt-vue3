<script setup>
import { ref, watchEffect } from 'vue';
import { useHeaders } from '../../utils/http-headers';
import { showError, successMsg } from '../../utils/toast-notification';
import { useCategoryStore } from '../../stores/category/category-store';

import handleApiError from '../../utils/handle-parse-error';
import { storeToRefs } from 'pinia';

const headers = useHeaders()
const isLoading = ref(false);
const submitEnable = ref(false);
const props = defineProps(["isShow"]);
const emit = defineEmits(["toggleCategoryModal", "refreshCategories"]);

const categoryStore = useCategoryStore()
const { categoryInput, edit } = storeToRefs(categoryStore)

watchEffect(() => {
  console.log("categoryInput.value", categoryInput.value)
  submitEnable.value = categoryInput.value.name.trim().length > 0
});

async function submitInput() {
  try {
    isLoading.value = true;
    const categoryEndpoint = edit.value ? 
    "/api/admin/category/update-category" :
    "/api/admin/category/create-category"

    const response = await $fetch(categoryEndpoint, {
      method: "POST",
      body: JSON.stringify(categoryInput.value),
      headers: {...headers}
    })

    console.log("response", response)

    if (response.statusCode === 200) {
      
      isLoading.value = false;
      emit('refreshCategories')
      setTimeout(() => {
        emit('toggleCategoryModal')
      }, 500);
      successMsg(response.message)
    }
  } catch(error) {
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
      <h1 class="text-2xl font-bold">{{ edit ? "Edit" : "Create" }} category</h1>
    </template>

    <template #body>
      <BaseInput
      v-model="categoryInput.name"
      :type="'text'"
      :placeholder="!edit ? '' : 'Category name'"
      />
    </template>

    <template #footer>
      <BaseButton
      label="Close"
      class="bg-slate-400"
      @click="emit('toggleCategoryModal')"
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