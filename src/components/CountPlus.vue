<template>
	<div>
		<button @click="plusFun">按鈕</button>
		{{ modelValue }}
	</div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
	modelValue: {
		type: Number,
		default: 0,
	},
});
const emit = defineEmits(["update:modelValue"]);
const plusFun = () => {
	emit("update:modelValue", props.modelValue + 1);
};
</script>
<style scoped lang="scss"></style>
