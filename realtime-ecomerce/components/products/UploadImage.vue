
<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import handleApiError from '../../utils/handle-parse-error';
import { useProductsStore } from '../../stores/product/product-store';
import { showError, successMsg } from '../../utils/toast-notification';

const image = ref(false)
const isLoading = ref(false)
const props = defineProps(["isShow"])
const emit = defineEmits(["refreshProducts"])

const productStore = useProductsStore();
const { productId, isShowUploadImageModal } = storeToRefs(productStore)

function selectImage(event) {
  const selectImage = event.target.files[0]
  const output = document.querySelector("#outputImage")
  output.src = URL.createObjectURL(selectImage)
  output.onload = function () {
    URL.revokeObjectURL(selectImage);
  };
  image.value = selectImage
 }

 async function uploadImage() {
  try {
    if(image.value != null) {

      isLoading.value = true;
      const requestOptions = await productStore.uploadImagePayload(productId.value, image.value);
      const response = await $fetch("/api/admin/product/upload-image", requestOptions);

      successMsg(response.message);
      document.querySelector("#outputImage").src = "";
      document.querySelector("#imageInput").value = "";

      emit("refreshProducts");
    } else {
      showError("Please select an image");
    }
  } catch {
    isLoading.value = false;
    console.error("DELETE PRODUCTS ERROR: ", error)
    const { message } = handleApiError(error);
    showError(message)
  }
 }
</script>

<template>
  <BaseModal :isShow="isShowUploadImageModal">
  <template #title>
    <div class="text-2xl font-semibold">Upload Image</div>
  </template>

  <template #body>
    <img style="height: 150px" alt="image" id="outputImage" />
    <label for="">Select Image</label>

    <input @change="selectImage" type="file" id="imageInput" />
  </template>

  <template #footer>
    <BaseButton
    class="bg-slate-400"
    @click="isShowUploadImageModal = false"
    labe="Close"
    />
    <BaseBtn :isLoading="isLoading" @click="uploadImage" :label="'Upload Image'"></BaseBtn>
  </template>
  </BaseModal>
</template>