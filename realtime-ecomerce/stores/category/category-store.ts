import { computed, ref } from "vue";
import { useFetch } from "nuxt/app";
import { defineStore } from "pinia";
import { useHeaders } from "../../utils/http-headers";

export const useCategoryStore = defineStore('category-store', () => {
    
    const edit = ref(false)
    const categories = ref<any[]>([])
    const headers = useHeaders()
    const categoryInput = ref({
        id: null,
        name: ''
    })

    const fetchCategories = async () => {
        const {data,refresh:getCategories}=await useFetch("/api/admin/category/get-categories",{
            headers: {
               ...headers
              },
          });
          return{ data, getCategories }
        }
    
    return { edit, categoryInput, fetchCategories }
});  