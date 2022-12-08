<script setup>
import { ref } from "vue";
let name = ref("Danny");
const changeName = () => {
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
