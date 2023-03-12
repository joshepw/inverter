<script setup>
defineProps({
	color: {
		type: String,
		required: false
	},
})
</script>


<template>
	<div class="item" :class="`color-${color}`">
		<div><slot name="icon"></slot></div>
		<div class="details">
			<h4>
				<slot name="heading"></slot>
			</h4>
			<p>
				<slot></slot>
			</p>
		</div>
	</div>
</template>
  
<style scoped>
.item {
	margin-top: 1rem;
	display: flex;
	background-color: #2F3251;
	padding: 1rem;
	border-radius: 0.5rem;
}

.item.color-green {
	background-color: #1D3238;
	color: #A6BEBE;
}

.item.color-orange {
	background-color: #514641;
	color: #B4AFB8;
}

.item.color-red {
	background-color: #381f1d;
}

.item .details {
	display: flex;
	flex: 1;
	align-items: center;
	font-size: 1.2rem;
}

.item .details h4 {
	flex: 1;
}
</style>
  