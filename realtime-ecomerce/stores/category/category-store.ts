import { ref } from "vue";
import { useFetch } from "nuxt/app";
import { defineStore } from "pinia";
import { useHeaders } from "../../utils/http-headers";
import handleApiError from "../../utils/handle-parse-error";
import { showError } from "../../utils/toast-notification";

export const useCategoryStore = defineStore('category-store', () => {
    
    const edit = ref(false)
    const error = ref(null)
    const pending = ref(false)
    const headers = useHeaders()
    const categoriesData = ref([])
    const categoryInput = ref({
        id: null,
        name: ''
    })

    const fetchCategories = async () => {
        
        error.value = null
        pending.value = true
    
        try {
          const { data } = await useFetch('/api/admin/category/get-categories', {
            headers: { ...headers },
          })
    
          categoriesData.value = (data.value as any)?.categories || []
          console.log("CATEGORIES DATA IN STORE: ", JSON.stringify(categoriesData.value, null, 2))

        } catch (error: any) {
            error.value = error
            console.error("FETCH CATEGORIES ERROR: ", error.value)
            const { message } = handleApiError(error.value);
            showError(message)
        } finally { pending.value = false }
      }    
    return { edit, categoryInput, categoriesData, fetchCategories, pending, error }
});  