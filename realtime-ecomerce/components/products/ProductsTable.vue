<script setup>
import { debounce } from "vue-debounce";
import { storeToRefs } from "pinia";
import { useProductsStore } from "../../stores/product/product-store";

import EyeIcon from "../assets/icons/EyeIcon.vue";
import EditIcon from "../assets/icons/EditIcon.vue";
import TrashIcon from "../assets/icons/TrashIcon.vue";
import ImageIcon from "../assets/icons/ImageIcon.vue";

const props = defineProps(["products", "page", "limit", "totalPages"]);
const emit = defineEmits([
  "editProduct",
  "deleteProduct",
  "uploadImage",
  "showUploadedImage",
]);
// const productStore = useProductsStore();
// const { search, productsData } = storeToRefs(productStore);

const searchProducts = debounce(async function (event) {
  // search.value = event.target.value;
  // console.log("SEARCH PRODUCTS: ", search.value);
  // await productStore.fetchProducts();
}, 1000);

function nextPage() {
  productStore.changePage((page += 1));
}

function prevPage() {
  productStore.changePage((page -= 1));
}
</script>

<template>
  <div class="flex justify-between mb-1">
    <input
      v-model="search"
      placeholder="Search..."
      type="text"
      @keydown="searchProducts"
      class="max-w-[350px] w-full mb-2 border font-medium text-base rounded-md p-2 shadow-md"
    />
    <slot name="btn"></slot>
  </div>

  <table class="w-full bg-white rounded-md shadow-md border border-gray-300">
    <thead>
      <tr class="bg-gray-100 text-left">
        <td class="border border-gray-300 py-2 px-4">#</td>

        <td class="border border-gray-300 py-2 px-4">Name</td>
        <td class="border border-gray-300 py-2 px-4">Category</td>
        <td class="border border-gray-300 py-2 px-4">Color</td>
        <td class="border border-gray-300 py-2 px-4">Price</td>

        <td class="border border-gray-300 py-2 px-4">Action</td>
      </tr>
    </thead>
    <tbody>
      <tr
        class="text-left"
        v-for="(product, index) in products"
        :key="product.id"
      >
        <td class="border border-gray-300 py-2 px-4">{{ index + 1 }}</td>
        <td class="border border-gray-300 py-2 px-4">{{ product?.name }}</td>
        <td class="border border-gray-300 py-2 px-4">
          {{ product?.category?.name }}
        </td>
        <td class="border border-gray-300 py-2 px-4">{{ product?.color }}</td>
        <td class="border border-gray-300 py-2 px-4">{{ product?.price }}</td>
        <td class="flex border border-gray-300 py-2 px-4">
          <button
            @click="emit('editProduct', product)"
            class="flex justify-center hover:bg-slate-200 text-gray-900 font-bold py-2 px-4 rounded item-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <EditIcon />
          </button>

          <button
            @click="emit('deleteProduct', product)"
            class="flex justify-center hover:bg-slate-200 text-gray-900 font-bold py-2 px-4 rounded item-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon />
          </button>

          <button
            @click="emit('uploadImage', product)"
            class="flex justify-center hover:bg-slate-200 text-gray-900 font-bold py-2 px-4 rounded item-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImageIcon />
          </button>
          <button
            @click="emit('showUploadedImage', product)"
            class="flex justify-center hover:bg-slate-200 text-gray-900 font-bold py-2 px-4 rounded item-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <EyeIcon />
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="w-full flex justify-end gap-8 items-center mt-4">
    <button
      class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="page === 1 ?? true"
      @click="prevPage"
    >
      Prev
    </button>
    <span>Page {{ page }} of {{ totalPages }}</span>
    <button
      class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="isLastPage ?? true"
      @click="nextPage"
    >
      Next
    </button>
  </div>
</template>
