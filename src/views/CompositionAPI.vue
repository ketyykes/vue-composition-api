<script>
import { onMounted, ref } from "vue";
export default {
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
	// 不該在CompositionAPI當中混用OptionAPI的寫法
	// mounted() {
	// 	console.log(this.count);
	// },
};
</script>

<template>
	<div>VueCompositionAPI：{{ count }}</div>
	<button @click="increment">Count is: {{ count }}</button>
</template>
