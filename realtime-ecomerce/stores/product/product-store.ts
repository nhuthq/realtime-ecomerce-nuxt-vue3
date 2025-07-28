import { ref } from "vue";
import { defineStore } from "pinia";
import { useHeaders } from "../../utils/http-headers";

import handleApiError from "../../utils/handle-parse-error";
import { errorMsg } from "../../utils/toast-notification";


export const useProductsStore = defineStore("products-store", () => {
  const headers = useHeaders();
  const productInput = ref({
    id: null,
    name: "",
    color: "",
    price: null,
    categoryId: null,
  });

  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(0);
  const search = ref("");
  const edit = ref(false);
  const productId = ref(null);
  const productsData = ref([]);

  const uploadProductImages = ref([]);
  const productColors = ref([
    "Red",
    "Black",
    "White",
    "Green",
    "Blue",
    "Yellow",
    "Orange",
    "Gray",
  ]);

  async function fetchProducts() {
    try {
      const response = await $fetch<{ products: any; metadata: any }>(
        "/api/admin/product/get",
        {
          headers: { ...headers },
          query: {
            page: page.value,
            limit: limit.value,
          },
        },
      );
      productsData.value = response.products;
      limit.value = response.metadata?.limit;
      page.value = response.metadata?.page;
      totalPages.value = response.metadata?.totalPages;
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR: ", error);
      const { message } = handleApiError(error);
      errorMsg(message)
    }
  }

  async function changePage(newPage: number) {
    page.value = newPage;
    await fetchProducts();
  }

  async function uploadImagePayload(productId: number, imageFile: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();

        formData.append("file", imageFile);
        formData.append("productId", productId.toString());
        // formData.append("Authorization", headers?.Authorization);

        const requestOption = {
          headers: { ...headers },
          method: "POST",
          body: formData,
        };
        resolve(requestOption);

        const respones = await $fetch("/api/admin/product/upload-image", {
          headers: {
            ...headers,
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  return {
    edit,
    page,
    limit,
    search,
    productId,
    totalPages,
    productsData,
    productInput,
    productColors,
    uploadProductImages,
    fetchProducts,
    changePage,
    uploadImagePayload,
  };
});
