<template>
	<div>
		<Child :parent="object" />
		<button @click="propsToChild">按鈕</button>
	</div>
</template>
<script setup>
import Child from "../components/Child.vue";
import { ref } from "vue";

const object = ref([{ name: "哈囉" }, { old: 12 }]);
const propsToChild = () => {
	object.value[0].name = "世界";
	console.log(object.value);
	// object.value = {
	// 	name: "世界",
	// };
};
</script>
<style scoped lang="scss"></style>
