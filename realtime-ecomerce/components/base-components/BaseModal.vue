<script setup>
const props = defineProps(["isShow"]);

</script>

<template>
  <div 
  v-show="isShow"
  class="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center p-4 sm:p-6">
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:w-2/3 md:w-1/2 lg:w-1/3 ease-out scale-95 opacity-0 animate-modalFadeIn">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <slot name="title"></slot>
        </div>
        <!-- Body -->
        <div class="py-4">
            <slot name="body"></slot>
        </div>
        <!-- Footer -->
        <div class="flex gap-2 justify-end mt-4">
            <slot name="footer"></slot>
        </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
.animate-modalFadeIn {
    animation: modalFadeIn 0.3s ease-out forwards;
}
</style>