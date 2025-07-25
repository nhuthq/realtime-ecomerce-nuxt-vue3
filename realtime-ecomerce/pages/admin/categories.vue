<script  setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '../../stores/category/category-store';
import BaseButton from '../../components/base-components/BaseButton.vue';

  definePageMeta({
      layout: 'admin'
  })

  const isShowModal = ref(false)

  function toggleShowCategoryModal() {
    isShowModal.value = !isShowModal.value
  }

  const categoryStore = useCategoryStore()
  const { categoryInput } = storeToRefs(categoryStore)
  const { data, getCategories } = await categoryStore.fetchCategories()

  function editCategory(category) {
    categoryInput.value = category
    categoryStore.edit = true
    toggleShowCategoryModal()
  }
  </script>

<template>
    <div class="h-full w-ful">
      <div class="flex flex-col items-center justify-center ">
        <BaseButton class="self-end mb-4" label="Create New" @click="toggleShowCategoryModal"/>

        <ClientOnly>
          <CategoryModal
          :isShow="isShowModal"
          @refreshCategories="getCategories"
          @toggleCategoryModal="toggleShowCategoryModal"
          />
        </ClientOnly>

        <CategoryTable
        :categories="data.data"
        @editCategory="editCategory"
        />
      </div>
    </div>
  </template>
  
  