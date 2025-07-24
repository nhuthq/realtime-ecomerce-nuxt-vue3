<template>
    <input
    @input="updateInput"
    :type="typeof type !== 'undefined' ? type : 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400
    focus:outline-hidden focus:ring-2  focus:border-brand-400"
    />
</template>

<script setup>

const props = defineProps(["type", "modelValue", "placeholder"]);

const emit = defineEmits(["update:modelValue"]);

function updateInput(event) {
    const val = event.target.value;
    emit("update:modelValue", val);
}

</script>