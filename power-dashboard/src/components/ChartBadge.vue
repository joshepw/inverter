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
} from 'chart.js';

import { Line } from 'vue-chartjs';

const props = defineProps({
	data: Array,
});

ChartJS.register(
	CategoryScale,
	LinearScale,
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
	},
	elements: {
		line: {
			tension: 0.2,
			backgroundColor: function () {
				const canva = document.getElementById(dashId);

				if (!canva) {
					return null;
				}

				const ctx = canva.getContext('2d');

				var gradient = ctx.createLinearGradient(0, 0, 0, 50);
				gradient.addColorStop(0, 'rgba(80, 150, 127, 1)');
				gradient.addColorStop(1, 'rgba(80, 150, 127, 0)');

				return gradient;
			},
			borderColor: 'rgba(80, 150, 127, 1)',
			fill: true,
		},
		point: {
			radius: 0,
		},
	},
	scales: {
		x: {
			display: false,
			grid: {
				display: false,
			},
			ticks: {
				display: false,
			},
		},
		y: {
			display: false,
			grid: {
				display: false,
			},
			ticks: {
				display: false,
			},
		},
	},
};

const dataTemplate = (values) => {
	return {
		labels: ['', '', '', '', '', ''],
		datasets: [
			{
				data: [0,0,0,0,0,0].concat(values || []).splice(-6),
			},
		],
	};
};
</script>

<template>
	<div class="chart-item">
		<div class="header">
			<div class="title">
				<p>
					<slot name="title"></slot>
				</p>
				<p><small>
						<slot name="description"></slot>
					</small></p>
			</div>

			<div class="value">
				<slot></slot>
			</div>
		</div>

		<div class="chart">
			<Line v-if="data?.length || 0" :data="dataTemplate(data)" :options="options" :id="dashId" />
		</div>
	</div>
</template>
  
<style scoped>
.chart-item {
	margin-top: 1rem;
	background-color: #2F3251;
	border-radius: 0.5rem;
	overflow: hidden;
}

.chart-item .header .title p {
	margin: 0;
	line-height: 1.1em;
}

.chart-item .header .title small {
	opacity: 0.7;
}

.chart-item .header .value {
	font-size: 2rem;
	margin: 0;
	line-height: 1em;
}

.chart-item .header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 1rem;
}

.chart-item .chart {
	margin: 0.25rem -5px;
	height: 50px;
}</style>
  