<script  setup>
import { ref } from 'vue';
import { useProductsStore } from '../../stores/product/product-store';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '../../stores/category/category-store';
import { promptUser } from '../../utils/sweet-alert';

definePageMeta({
  layout: 'admin'
})

const isShowModal = ref(false)
const productStore = useProductsStore()
const categoriesStore = useCategoryStore()
const {
  edit,
  productId,
  productsData,
  productInput,
  uploadProductImages,
  isShowUploadImageModal,
  isShowUploadedImageModal,
} = storeToRefs(productStore)

// FETCH DATA
await productStore.fetchProducts()
await categoriesStore.fetchCategories()

function toggleProductModal() {
  isShowModal.value = !isShowModal.value
}

async function deleteProduct(product) {
  promptUser("Are you sure you want to delete this product?").then(async (result) => {
    if (result) {
      await productStore.deleteProduct(product?.id);
      await productStore.fetchProducts();
    }
  })
}

async function editProduct(product) {
  productInput.value = product
  edit.value = true
  toggleProductModal()
}

function uploadImage(product) {
  productId.value = product?.id
  isShowUploadImageModal.value= true
}

function showUploadedImage(product) {
  productId.value = product?.id
  isShowUploadedImageModal.value= true
}

</script>

<template>
    <div class="w-full h-full">
      <div class="flex justify-end mb-4 pt-4">
        <BaseButton class="mb-4" label="Create New" @click="toggleProductModal"/>
        
        <ClientOnly>
          
          <ProductModal
            :isShow="isShowModal"
            :categories="categoriesStore.categoriesData"
            @toggleProductModal="toggleProductModal"
            @refreshProducts="productStore.fetchProducts"/>
          <UploadImage @refreshProducts="productStore.fetchProducts"/>
          <UploadedImageModal/>
          
        </ClientOnly>
      </div>

      <ProductTable
        :products="productsData"
        @editProduct="editProduct"
        @deleteProduct="deleteProduct"
        @uploadImage="uploadImage"
        @showUploadedImage="showUploadedImage"/>
    </div>
  </template>
  
  