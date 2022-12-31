<script setup>
//import你的component
import { ref, computed } from "vue";
import CountPlus from "../components/CountPlus.vue";

const a = ref(5);

const c = computed(() => {
	return a.value * 2;
});

const changAFun = (val) => {
	a.value = val;
	console.log(val);
	console.log("haha");
};

const computedC = computed({
	get() {
		return a.value * 2;
	},
	set(val) {
		a.value = val;
		console.log(val);
		console.log("haha");
	},
});

const b = ref(100);
const plusBFunc = (val) => {
	console.log(val);
	console.log("haha");
	b.value = val;
};

const computedB = computed({
	get() {
		return b.value;
	},
	set(val) {
		console.log(val);
		console.log("haha");
		b.value = val;
	},
});
</script>

<template>
	<main>
		a
		<CountPlus v-model="a" />
		c
		<CountPlus :modelValue="c" @update:modelValue="changAFun" />
		c
		<CountPlus v-model="computedC" />
		b
		<CountPlus :modelValue="b" @update:modelValue="plusBFunc" />
		b
		<CountPlus v-model="computedB" />
	</main>
</template>
