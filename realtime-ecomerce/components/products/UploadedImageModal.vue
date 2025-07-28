<script setup>
import { storeToRefs } from 'pinia';
import { useProductsStore } from '../../stores/product/product-store';

const productStore = useProductsStore()
const { uploadProductImages, isShowUploadedImageModal } = storeToRefs(productStore)
</script>

<template>
  <BaseModal :isShow="isShowUploadedImageModal">
    <template #title>
      <div class="text-2xl font-semibold">Uploaded Images</div>
      </template>

    <template #body>
      <div class="flex flex-wrap gap-4">
        <img
        v-for="image in uploadProductImages"
        :key="image.id"
        :src="image.url"
        style="height: 150px"
        alt="image"/>
        </div>
      </template>

    <template #footer>
      <BaseButton
      class="bg-slate-400"
      @click="isShowUploadedImageModal = false"
      label="Close"
      />
    </template>
  </BaseModal>
</template>