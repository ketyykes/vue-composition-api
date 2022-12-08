<script setup>
import { RouterLink, RouterView } from "vue-router";
import OptionAPI from "./views/OptionAPI.vue";
import CompositionAPI from "./views/CompositionAPI.vue";
</script>

<template>
	<header></header>
	<CompositionAPI />
	<RouterView />
</template>

<style></style>
