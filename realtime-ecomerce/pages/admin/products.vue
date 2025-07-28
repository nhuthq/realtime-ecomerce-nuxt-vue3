<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { promptUser } from "../../utils/sweet-alert";
import { useHeaders } from "../../utils/http-headers";
import { errorMsg, successMsg } from "../../utils/toast-notification";
import { useProductsStore } from "../../stores/product/product-store";
import { useCategoryStore } from "../../stores/category/category-store";

import handleApiError from "../../utils/handle-parse-error";

definePageMeta({
  layout: "admin",
});

const headers = useHeaders();
const productStore = useProductsStore();
const categoriesStore = useCategoryStore();
const { edit, productId, productInput, uploadProductImages } = storeToRefs(productStore);

const isShowProductModal = ref(false);
const isShowUploadImageModal = ref(false);
const isShowUploadedImageModal = ref(false);

// FETCH DATA
await productStore.fetchProducts();
await categoriesStore.fetchCategories();

function toggleProductModal() {
  isShowProductModal.value = !isShowProductModal.value;
}

function toggleUploadImageModal() {
  isShowUploadImageModal.value = !isShowUploadImageModal.value;
}

function toggleUploadedImageModal() {
  isShowUploadedImageModal.value = !isShowUploadedImageModal.value;
}

async function confirmDeleteProduct(product) {
  promptUser("Are you sure you want to delete this product?").then(
    async (result) => {
      if (result) {
        await deleteProduct(product?.id);
      }
    },
  );
}

async function deleteProduct(id) {
  try {
    const respones = await $fetch("/api/admin/product/delete", {
      headers: {
        ...headers,
      },
      method: "DELETE",
      body: {
        id: id,
      },
    });
    console.log("DELETE PRODUCT RESPONSE: ", respones);
    if (respones.statusCode === 200) {
      successMsg(respones.message);
      await productStore.fetchProducts();
    }
  } catch (error) {
    console.error("DELETE PRODUCT ERROR: ", error);
    const message = handleApiError(error);
    errorMsg(message);
  }
}

async function refreshProducts() {
  await productStore.fetchProducts();
}

async function editProduct(product) {
  productInput.value = product;
  edit.value = true;
  toggleProductModal();
}

function uploadImage(product) {
  console.log("UPLOAD IMAGE: ", product);
  productId.value = product?.id;
  toggleUploadImageModal();
}

function showUploadedImage(product) {
  uploadProductImages.value = product?.images;
  isShowUploadedImageModal.value = true;
}
</script>

<template>
  <div class="w-full h-full">
    <div class="flex justify-end mb-4 pt-4">
      <BaseButton class="mb-4" label="Create New" @click="toggleProductModal" />

      <ClientOnly>
        <ProductModal
          :isShow="isShowProductModal"
          :categories="categoriesStore.categoriesData"
          @refreshProducts="refreshProducts"
          @toggleProductModal="toggleProductModal"
        />
        <UploadImageModal
          :isShow="isShowUploadImageModal"
          @toggleUploadImageModal="toggleUploadImageModal"
          @refreshProducts="productStore.fetchProducts"
        />
        <UploadedImageModal
        :isShow="isShowUploadedImageModal"
        @toggleUploadedImageModal="toggleUploadedImageModal"
         />
      </ClientOnly>
    </div>

    <ProductsTable
      :products="productStore.productsData"
      :page="productStore.page"
      :limit="productStore.limit"
      :totalPages="productStore.totalPages"
      @editProduct="editProduct"
      @uploadImage="uploadImage"
      @deleteProduct="confirmDeleteProduct"
      @showUploadedImage="showUploadedImage"
    />
  </div>
</template>
