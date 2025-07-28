<script setup>
import { ref } from "vue";
import { useProductsStore } from "../../stores/product/product-store";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "../../stores/category/category-store";
import { promptUser } from "../../utils/sweet-alert";
import handleApiError from "../../utils/handle-parse-error";
import { useHeaders } from "../../utils/http-headers";
import { successMsg } from "../../utils/toast-notification";

definePageMeta({
  layout: "admin",
});

const headers = useHeaders();
const isShowModal = ref(false);
const productStore = useProductsStore();
const categoriesStore = useCategoryStore();
const {
  edit,
  productId,
  productInput,
  uploadProductImages,
  isShowUploadImageModal,
  isShowUploadedImageModal,
} = storeToRefs(productStore);

// FETCH DATA
await productStore.fetchProducts();
await categoriesStore.fetchCategories();

function toggleProductModal() {
  isShowModal.value = !isShowModal.value;
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
    showError(message);
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
  productId.value = product?.id;
  isShowUploadImageModal.value = true;
}

function showUploadedImage(product) {
  productId.value = product?.id;
  isShowUploadedImageModal.value = true;
}
</script>

<template>
  <div class="w-full h-full">
    <div class="flex justify-end mb-4 pt-4">
      <BaseButton class="mb-4" label="Create New" @click="toggleProductModal" />

      <ClientOnly>
        <ProductModal
          :isShow="isShowModal"
          :categories="categoriesStore.categoriesData"
          @refreshProducts="refreshProducts"
          @toggleProductModal="toggleProductModal"
        />
        <UploadImage @refreshProducts="productStore.fetchProducts" />
        <UploadedImageModal />
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
