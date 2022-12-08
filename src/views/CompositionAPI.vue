<script>
import { onMounted, ref } from "vue";
import HelloWorld from "../components/HelloWorld.vue";
export default {
	components: {
		HelloWorld,
	},
	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	setup() {
		const count = ref(0);

		const increment = () => {
			count.value += 1;
		};
		onMounted(() => {
			console.log(count.value);
		});
		return { count, increment };
	},
};
</script>

<template>
	<div>VueCompositionAPI：{{ count }}</div>
	<button @click="increment">Count is: {{ count }}</button>
</template>
