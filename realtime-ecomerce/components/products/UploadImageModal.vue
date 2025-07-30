<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useProductsStore } from "../../stores/product/product-store";

import handleApiError from "../../utils/handle-parse-error";
import { errorMsg } from "../../utils/toast-notification";

const image = ref(false);
const isLoading = ref(false);
const props = defineProps(["isShow"]);
const emit = defineEmits(["toggleUploadImageModal", "refreshProducts"]);

const productStore = useProductsStore();
const { productId } = storeToRefs(productStore);

function selectImage(event) {
  const selectImage = event.target.files[0];
  const output = document.querySelector("#outputImage");
  output.src = URL.createObjectURL(selectImage);
  output.onload = function () {
    URL.revokeObjectURL(selectImage);
  };
  image.value = selectImage;
}

async function uploadImage() {
  try {
    if (image.value != null) {
      isLoading.value = true;
      const requestOptions = await productStore.uploadImagePayload(
        productId.value,
        image.value,
      );
      const response = await $fetch(
        "/api/admin/product/upload-image",
        requestOptions,
      );

      if (response.statusCode === 200) {
        isLoading.value = false;
        successMsg(response.message);
        document.querySelector("#outputImage").src = "";
        document.querySelector("#imageInput").value = "";
      }

      emit("refreshProducts");
    } else {
      errorMsg("Please select an image");
    }
  } catch {
    isLoading.value = false;
    console.error("DELETE PRODUCTS ERROR: ", error);
    const { message } = handleApiError(error);
    errorMsg(message);
  }
}
</script>

<template>
  <BaseModal :isShow="isShow">
    <template #title>
      <div class="text-2xl font-semibold">Upload Image</div>
    </template>

    <template #body>
      <div class="flex flex-col items-start justify-center gap-5">
        <img
          v-show="image"
          style="height: 150px; width: auto"
          alt="image"
          id="outputImage"
        />
        <label for="imageInput" class="text-base font-medium mb-5"
          >Select Image</label
        >

        <input @change="selectImage" type="file" id="imageInput" />
      </div>
    </template>

    <template #footer>
      <BaseButton
        class="bg-slate-400"
        @click="emit('toggleUploadImageModal')"
        label="Close"
      />
      <BaseButton
        :isLoading="isLoading"
        :disabled="!image"
        :label="'Upload Image'"
        @click="uploadImage"
      />
    </template>
  </BaseModal>
</template>
