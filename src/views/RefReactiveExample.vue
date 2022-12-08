<script setup>
import { reactive, ref, watch } from "vue";
const person1 = ref({
	name: "Tom",
	age: 24,
	address: "台北",
});
const person2 = reactive({
	name: "Danny",
	age: 18,
	address: "台南",
});
setTimeout(() => {
	person1.value.name = "Hello";
	person2.name = "Hello";
}, 2000);
watch(person1, () => {
	console.log("person1被改變了");
});
watch(person2, () => {
	console.log("person2被改變了");
});
</script>

<template></template>
