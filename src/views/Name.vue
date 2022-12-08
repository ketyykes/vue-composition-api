<script setup>
import { ref } from "vue";
//必須使用const宣告
const name = ref("Danny");

const changeName = () => {
	//改變的時候式改變其value如下
	name.value = "Jacky";
	console.log(name);
};
</script>

<template>
	<div>
		{{ name }}
	</div>
	<button @click="changeName">click</button>
</template>
