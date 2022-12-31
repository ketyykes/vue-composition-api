<script setup>
import { computed } from "@vue/reactivity";
import { ref } from "vue";
const count = ref(1);
const plusOne = computed({
	get: () => {
		return count;
	},
	//當plusOne被設值的時候就會改變count的值
	set: (val) => {
		count.value = val;
	},
});

// 這邊設值plusOne
plusOne.value = 99;
//因為computed的屬性有setter所以最後就會改變count.vaLue
console.log(count.value);
</script>

<template>
	<div>{{ data }}</div>
</template>
