<template>
	<div>Child</div>
	<div>{{ props.parent[0].name }}</div>
</template>
<script setup>
const props = defineProps({
	parent: Object,
});
</script>
<style scoped lang="scss"></style>
