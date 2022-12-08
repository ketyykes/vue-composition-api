<script setup>
import { computed } from "@vue/reactivity";
import { ref } from "vue";
const idx = ref(0);
const data = computed(() => {
	return idx.value ? "這個大於三" : "這個小於三";
});
setTimeout(() => {
	idx.value = 8;
}, 2000);
</script>

<template>
	<div>{{ data }}</div>
</template>
