<script setup>
import { reactive, ref } from "vue";
const name = ref("Tom");
const person = reactive({
	name: "Danny",
	age: 18,
	address: "台南",
});
</script>

<template>
	<div>{{ person.name }}</div>
	<div>{{ person.age }}</div>
	<div>{{ person.address }}</div>
</template>
<script setup>
import { reactive, ref } from "vue";
const name = ref("Tom");
const person = reactive({
	name: "Danny",
	age: 18,
	address: "台南",
});
person.name = "Hello";
</script>
