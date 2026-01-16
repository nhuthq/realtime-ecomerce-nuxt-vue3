<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "../../stores/category/category-store";
import BaseButton from "../../components/base-components/BaseButton.vue";

definePageMeta({
  layout: "admin",
});
const isShowCategoryModal = ref(false);
function toggleShowCategoryModal() {
  isShowCategoryModal.value = !isShowCategoryModal.value;
}

const categoryStore = useCategoryStore();
const { categoryInput } = storeToRefs(categoryStore);
await categoryStore.fetchCategories();

async function refreshCategories() {
  await categoryStore.fetchCategories();
}

function editCategory(category) {
  categoryInput.value = category;
  categoryStore.edit = true;
  toggleShowCategoryModal();
}
</script>

<template>
  <div class="h-full w-ful">
    <div class="flex flex-col items-center justify-center">
      <BaseButton
        class="self-end mb-4"
        label="Create New"
        @click="toggleShowCategoryModal"
      />

      <ClientOnly>
        <CategoryModal
          :isShow="isShowCategoryModal"
          @refreshCategories="refreshCategories"
          @toggleCategoryModal="toggleShowCategoryModal"
        />
      </ClientOnly>

      <CategoryTable
        @editCategory="editCategory"
        :categories="categoryStore.categoriesData"
      />
    </div>
  </div>
</template>
