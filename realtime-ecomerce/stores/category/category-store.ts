import { ref } from "vue";
import { defineStore } from "pinia";
import { useHeaders } from "../../utils/http-headers";
import { errorMsg } from "../../utils/toast-notification";

import handleApiError from "../../utils/handle-parse-error";

export const useCategoryStore = defineStore("category-store", () => {
  const edit = ref(false);
  const error = ref(null);
  const pending = ref(false);
  const headers = useHeaders();
  const categoriesData = ref([]);
  const categoryInput = ref({
    id: null,
    name: "",
  });
  const fetchCategories = async () => {
    error.value = null;
    pending.value = true;

    try {
      const response = await $fetch<{ categories: any }>(
        "/api/admin/category/get-categories",
        {
          headers: { ...headers },
        },
      );

      categoriesData.value = response?.categories || [];
    } catch (error: any) {
      error.value = error;
      console.error("FETCH CATEGORIES ERROR: ", error.value);
      const { message } = handleApiError(error.value);
      errorMsg(message);
    } finally {
      pending.value = false;
    }
  };
  return {
    edit,
    categoryInput,
    categoriesData,
    fetchCategories,
    pending,
    error,
  };
});
