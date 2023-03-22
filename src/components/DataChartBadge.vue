<script setup>
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	BarElement,
} from 'chart.js';

import { Bar } from 'vue-chartjs';
import { reactive } from 'vue';

const state = reactive({filter: 'month'});

const emit = defineEmits([
	'filter'
]);

const props = defineProps({
	data: Object,
});

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const dashId = `dashchart-${Math.floor(Math.random() * 100)}`;

const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			yAlign: 'bottom',
			titleColor: 'rgb(154, 159, 178)',
			bodyColor: 'rgb(154, 159, 178)',
			backgroundColor: 'rgb(38, 40, 64)',
			displayColors: false,
		}
	},
	elements: {
		bar: {
			tension: 0.2,
		},
		point: {
			radius: 4,
		},
	},
	scales: {
		x: {
			stacked: true,
			grid: {
				display: false,
			},
			ticks: {
				color: 'rgba(154, 159, 178, 0.7)',
			},
		},
		y: {
			stacked: true,
			display: false,
		},
	},
};

const onFilter = (value) => {
	emit('filter', value);
};
</script>

<template>
	<div class="chart-item">
		<div class="header">
			<div class="title">
				<p>
					<slot name="title"></slot>
				</p>
				<div class="selector">
					<a href="javascript:;" :class="{active: data.type == 'day'}" v-on:click="onFilter('day')">DAY</a>
					<a href="javascript:;" :class="{active: data.type == 'month'}" v-on:click="onFilter('month')">MONTH</a>
					<a href="javascript:;" :class="{active: data.type == 'year'}" v-on:click="onFilter('year')">YEAR</a>
				</div>
			</div>

			<div class="value">
				<slot></slot>
			</div>
		</div>

		<div class="chart">
			<Bar v-if="data || 0" :data="data" :options="options" :id="dashId" />
		</div>
	</div>
</template>
  
<style scoped>
.chart-item {
	margin-top: 1rem;
	background-color: #2F3251;
	border-radius: 0.5rem;
	overflow: hidden;
	padding: 1rem;
}

.chart-item .header .title p {
	margin: 0;
	line-height: 1.1em;
}

.chart-item .header .title .selector {
	display: block;
	margin-top: 0.5rem;
}

.chart-item .header .title .selector a {
	display: inline-block;
	margin-right: 8px;
	background-color: rgb(34, 36, 63);
	color: rgb(106, 109, 135);
	font-size: 12px;
	padding: 4px 10px;
	border-radius: 2px;
}

.chart-item .header .title .selector a.active {
	background-color: rgb(77, 83, 129);
	color: rgb(181, 184, 204);
}

.chart-item .header .value {
	font-size: 2rem;
	margin: 0;
	line-height: 1.2em;
	text-align: right;
}

.chart-item .header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding-bottom: 1rem;
}

.chart-item .chart {
	height: 150px;
}</style>
  