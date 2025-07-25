<script setup>
import EditIcon from "../assets/icons/EditIcon.vue";

const props = defineProps(["categories"]);
const emit = defineEmits(["editCategory"]);

console.log("CATEGORIES", props.categories)
</script>

<template>
  <table class="w-full h-full bg-white rounded-md shadow-sm border border-gray-300">
    <thead>
      <tr class="bg-gray-100 text-left">
        <td class="border border-gray-300 py-2 px-4">#</td>
        <td class="border border-gray-300 py-2 px-4">Name</td>
        <td class="border border-gray-300 py-2 px-4">Actions</td>
      </tr>
    </thead>
    <tbody>
      <tr class="text-left" v-for="(category, index) in categories" :key="category.id">
        <td class="border border-gray-300 py-2 px-4">{{ index + 1 }}</td>
        <td class="border border-gray-300 py-2 px-4">{{ category?.name ?? "" }}</td>
        <td class="border border-gray-300 py-2 px-4">
          <button
            class="flex justify-center hover:bg-slate-200 text-gray-900 font-bold py-2 px-4 rounded items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="emit('editCategory', category)"
          >
            <EditIcon />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
