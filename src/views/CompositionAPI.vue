<script setup>
import { onMounted, ref } from "vue";
import HelloWorld from "../components/HelloWorld.vue";
const props = defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
});
const count = ref(0);

const increment = () => {
	count.value += 1;
};
onMounted(() => {
	console.log(count.value);
});
</script>

<template>
	<div>VueCompositionAPI：{{ count }}</div>
	<button @click="increment">Count is: {{ count }}</button>
</template>
