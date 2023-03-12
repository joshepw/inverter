<script setup>
defineProps({
	active: Boolean
});
</script>

<template>
	<img v-if="active" src="../assets/grid.png" alt="">
	<img v-else src="../assets/offline.png" alt="">
</template>

<style scoped>
img {
	width: 24px;
	margin-right: 0.5rem;
	height: auto;
	display: block;
	padding: 4px 0;
}
</style>