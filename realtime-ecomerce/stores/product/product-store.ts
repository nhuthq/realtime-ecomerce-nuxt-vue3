import { defineStore } from "pinia";
import { ref } from "vue";
import { useHeaders } from "../../utils/http-headers";
import { useFetch } from "nuxt/app";
import handleApiError from "../../utils/handle-parse-error";
import { showError } from "../../utils/toast-notification";

export const useProductsStore = defineStore("products-store",() => {
    
    const headers = useHeaders()
    const productInput = ref({ id: null, name: "", color: "", categoryId: null, price: 0 });
    
    const page = ref(1)
    const limit = ref(10)
    const search = ref("")
    const edit = ref(false)
    const productId = ref(null)
    const productsData = ref([])
    
    const uploadProductImages = ref([])
    const isShowUploadImageModal = ref(false)
    const isShowUploadedImageModal = ref(false)
    const productColors=ref(['Red','Black','White','Green','Blue','Yellow','Orange','Gray'])

    async function fetchProducts() {
        console.log("FETCH PRODUCTS: ")
        // try {
        //     const {data, refresh } = await useFetch("/api/admin/product/get-products",{
        //         headers: {
        //             ...headers
        //         },
        //         query: {
        //             page: page.value,
        //             limit: limit.value,
        //         }
        //     })
        //     console.log("PRODUCTS DATA: ", JSON.stringify(data.value,null,2))
            
        //     productsData.value = (data.value as any)?.products || []
            
        //     // limit.value = productsData.value?.metadata?.limit
        //     // page.value = productsData.value?.metadata?.page
            
        // } catch (error) {
            
        //     console.error("FETCH PRODUCTS ERROR: ", error)
        //     const { message } = handleApiError(error);
        //     showError(message)
        // }
    }

    async function deleteProduct(id: number) {
        try {
            const respones = await useFetch("/api/admin/product/delete-product",{
                headers: {
                    ...headers
                },
                method: "DELETE",
                body: {
                    id: JSON.stringify(id)
                }
            })
            console.log("DELETE PRODUCT RESPONSE: ", JSON.stringify(respones,null,2))
        } catch (error) {
            
            console.error("DELETE PRODUCTS ERROR: ", error)
            const { message } = handleApiError(error);
            showError(message)
        }
    }

    async function changePage(newPage: number) {
        page.value = newPage
        await fetchProducts()
    }

    async function uploadImagePayload(productId: number, imageFile: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const formData = new FormData()
    
                formData.append("file", imageFile);
                formData.append("productId", productId.toString());
                // formData.append("Authorization", headers?.Authorization);

                const requestOption = {
                    headers: { ... headers },
                    method: "POST",
                    body: formData
                };
                resolve(requestOption)
    
                const respones = await useFetch("/api/admin/product/upload-image",{
                    headers: {
                        ...headers
                    },
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    return { productInput, productColors, uploadProductImages, isShowUploadImageModal, isShowUploadedImageModal, edit, productId, search, page, limit, productsData, fetchProducts, deleteProduct, changePage, uploadImagePayload }
});