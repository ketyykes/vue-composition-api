<script setup>
import { ref, onMounted } from "vue";
const name = ref("Danny");

const changeName = () => {
	//改變的時候是改變其value如下
	//請勿寫成name = "Jacky"
	name.value = "Jacky";
	console.log(name);
};
onMounted(() => {
	console.log(name.value);
});
</script>

<template>
	<div>
		{{ name }}
	</div>
	<button @click="changeName">click</button>
</template>
