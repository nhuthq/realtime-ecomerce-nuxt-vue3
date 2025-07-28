<script setup>
import { storeToRefs } from 'pinia';
import { useProductsStore } from '../../stores/product/product-store';

import EyeIcon from "../assets/icons/EyeIcon.vue";
import EditIcon from "../assets/icons/EditIcon.vue";
import TrashIcon from "../assets/icons/TrashIcon.vue";
import ImageIcon from "../assets/icons/ImageIcon.vue";

const props = defineProps(["productsData"])
const emit = defineEmits(["editProduct", "deleteProduct", "uploadImage", "showUploadedImages"])
const productStore = useProductsStore()
const { search } = storeToRefs(productStore)

const searchProducts = _debounce(async function(event) {
    search.value = event[0].target.value

    console.log("SEARCH PRODUCTS: ", search.value)
    // await productStore.fetchProducts()
});

</script>

<template>
  <div class="flex justify-between mb-1">
    <input
    v-model="search"
    @keydown="searchProducts"
    placeholder="Search..."
    type="text"
    class="mb-2 border rounded-md p-2 shadow-md"
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
        <tr class="text-left" v-for="(product,index) in productsData" :key="product.id"> 
            <td class="border border-gray-300 py-2 px-4">{{ index + 1 }}</td>
            <td class="border border-gray-300 py-2 px-4">{{ product?.name }}</td>
            <td class="border border-gray-300 py-2 px-4">{{ product?.category?.name }}</td>
            <td class="border border-gray-300 py-2 px-4">{{ product?.color }}</td>
            <td class="border border-gray-300 py-2 px-4">{{ product?.price }}</td>
            <td class="flex border border-gray-300 py-2 px-4">
                <button
                @click="emit('editProduct', product)"
                class="flex justify-center hover:bg-slate-200 text-gray-900 font-bold py-2 px-4 rounded item-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <EditIcon />
            </td>
            
            <td class="flex border border-gray-300 py-2 px-4">
                <button
                @click="emit('deleteProduct', product)"
                class="flex justify-center hover:bg-slate-200 text-gray-900 font-bold py-2 px-4 rounded item-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <TrashIcon />
            </td>

            <td class="flex border border-gray-300 py-2 px-4">
                <button
                @click="emit('uploadImage', product)"
                class="flex justify-center hover:bg-slate-200 text-gray-900 font-bold py-2 px-4 rounded item-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <ImageIcon />
            </td>

            <td class="flex border border-gray-300 py-2 px-4">
                <button
                @click="emit('showUploadedImages', product)"
                class="flex justify-center hover:bg-slate-200 text-gray-900 font-bold py-2 px-4 rounded item-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <EyeIcon />
            </td>
        </tr>
    </tbody>
  </table>

  <div class="flex justify-between items-center mt-4">
    <div>
        <button
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="productsData?.metadata?.page === 1"
        @click="productStore.changePage(productsData?.metadata?.page - 1)"
        >Prev</button>
        <span>Page {{ productsData?.metadata?.page }} of {{ productsData?.metadata?.totalPages }}</span>

        <button
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="productsData?.metadata?.page === productsData?.metadata?.totalPages"
        @click="productStore.changePage(productsData?.metadata?.page + 1 )"
        >Nex</button>
    </div>
  </div>
</template>