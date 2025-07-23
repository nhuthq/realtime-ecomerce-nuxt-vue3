<template>
  <NuxtLoadingIndicator/>
  <div class="flext flex-col w-screen min-h-screen">
    <!-- <AppHeader/> -->
    <NuxtPage/>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
html,
body {
  background-color: #f3f4f6;
  color: #111827; // text-gray-900
  scroll-behavior: smooth;
}

img {
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
}

pre {
  border-radius: 0.5rem; // rounded
  background-color: #1f2937; // bg-gray-800
  margin: 2rem 0; // my-8
  font-size: 0.75rem; // text-xs
  color: white;
  padding: 1rem; // p-4
  white-space: pre-wrap;
  overflow: auto;
}

select {
  background-color: white;
  border: 1px solid #d1d5db; // border-gray-300
  border-radius: 0.375rem; // rounded-md
  font-weight: 500; // font-medium
  font-size: 0.875rem; // text-sm
  padding: 0.5rem 2.5rem 0.5rem 1rem; // pr-12, pl-4
  color: #6b7280; // text-gray-500
  display: inline-flex;
  align-items: center;
  appearance: none;
  position: relative;

  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3E%3Cpath stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 6l4 4 4-4'/%3E%3C/svg%3E")
    center right 10px no-repeat;
  background-size: 1rem;

  &:hover {
    background-color: #f9fafb; // hover:bg-gray-50
  }

  &:focus {
    z-index: 20;
  }
}

// Transition classes
.slide-from-right-leave-active,
.slide-from-right-enter-active,
.slide-from-left-leave-active,
.slide-from-left-enter-active {
  transition: transform 300ms ease-in-out;
}

.slide-from-right-enter-from,
.slide-from-right-leave-to {
  transform: translateX(500px);
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  transform: translateX(-500px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-y-enter-active,
.scale-y-leave-active {
  transition: all 500ms linear;
  will-change: max-height, opacity;
  max-height: 9999px;
  overflow: hidden;
  opacity: 1;
}

.scale-y-enter-from,
.scale-y-leave-to {
  max-height: 0;
  opacity: 0;
}

// Scrollbar
.custom-scrollbar::-webkit-scrollbar,
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f3f4f6; // bg-gray-100
  width: 0.375rem; // w-1.5
  border-radius: 0.25rem;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #9ca3af; // bg-gray-400
  border-radius: 0.25rem;
}

// Animations
@keyframes fadeIn {
  0% {
    opacity: 0.001;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeDisabledIn {
  0% {
    opacity: 0.001;
  }

  100% {
    opacity: 0.7;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.001;
  }
}

.page-enter-active,
.page-leave-active {
  transition: opacity 20ms;
}

.page-enter,
.page-leave-to {
  opacity: 0;
}

.page-enter-active {
  animation-duration: 200ms;
  animation-name: fadeIn;
  animation-timing-function: linear;
  backface-visibility: hidden;
}

.page-leave-active {
  animation-name: fadeOut;
  animation-duration: 200ms;
}

@keyframes skelaton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

img.skeleton {
  animation: skelaton 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
  background-image: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

// Checkbox & radio
input[type='checkbox'],
input[type='radio'] {
  background-color: white;
  border: 1px solid #d1d5db; // border-gray-300
  border-radius: 0.5rem; // rounded-lg
  outline: none;
  width: 1em;
  height: 1em;
  position: relative;
  padding: 0;
  cursor: pointer;
  transition: all 150ms ease-in-out;
  appearance: none;

  &:hover {
    border-color: #3b82f6; // primary
  }
}

input[type='radio'] {
  border-radius: 50%;
}

input[type='checkbox']::after,
input[type='radio']::after {
  content: '';
  display: block;
  opacity: 0;
  transition: all 250ms cubic-bezier(0.65, -0.43, 0.4, 1.71);
}

input[type='checkbox']::after {
  width: 5px;
  height: 9px;
  border: 2px solid #fff;
  border-top: 0;
  border-left: 0;
  transform: rotate(0deg) translate(-1px, 1px) scale(0.75);
  position: absolute;
  top: 3px;
  left: 6.5px;
}

input[type='radio']::after {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: scale(0);
  background: #fff;
  position: absolute;
  top: 4px;
  left: 4px;
}

input[type='checkbox']:checked::after {
  opacity: 1;
  transform: rotate(45deg) translate(-1px, 1px) scale(1);
}

input[type='radio']:checked::after {
  opacity: 1;
  transform: scale(1);
}

input[type='checkbox']:checked,
input[type='radio']:checked {
  background-color: #3b82f6; // bg-primary
  border: 0;
}

input[type='checkbox']:checked + label,
input[type='radio']:checked + label {
  color: #1f2937; // text-gray-800
}

input[type='checkbox'] + label,
input[type='radio'] + label {
  cursor: pointer;
  color: #4b5563; // text-gray-600

  &:hover {
    color: #3b82f6; // hover:text-primary
  }
}

</style>