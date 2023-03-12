<script setup>
import { computed } from 'vue';

const props = defineProps({
	percent: Number
});

const charge = computed(() => {
	if (props.percent > 80 && props.percent <= 100) {
		return 5;
	}

	if (props.percent > 60) {
		return 4;
	}

	if (props.percent > 40) {
		return 3;
	}

	if (props.percent > 20) {
		return 2;
	}

	return 1;
});
</script>

<template>
	<img v-if="charge == 1" src="../assets/battery_1.png" alt="">
	<img v-if="charge == 2" src="../assets/battery_2.png" alt="">
	<img v-if="charge == 3" src="../assets/battery_3.png" alt="">
	<img v-if="charge == 4" src="../assets/battery_4.png" alt="">
	<img v-if="charge == 5" src="../assets/battery_5.png" alt="">
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