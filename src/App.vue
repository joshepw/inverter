<script setup>
import Pull from 'pulljs';
import { reactive, onMounted, computed } from 'vue';
import SmartHome from "./components/SmartHome.vue";
import TopAnimation from "./components/TopAnimation.vue";
import StatusBadge from "./components/StatusBadge.vue";
import ChartBadge from "./components/ChartBadge.vue";
import DataChartBadge from "./components/DataChartBadge.vue";
import BatteryIcon from "./components/BatteryIcon.vue";
import GridIcon from "./components/GridIcon.vue";

const result = reactive({
	Device: {},
	Battery: {},
	Grid: {},
	L1: {},
	L2: {},
	Output: {},
});

const historyPower = reactive({
	l1: [],
	l2: [],
	consumption: null,
});

let ws = null;

onMounted(() => {
	Pull.init({
		mainElement: '#app',
		instructionsPullToRefresh: 'Pull to Refresh',
		instructionsReleaseToRefresh: 'Release to Refresh',
		instructionsRefreshing: 'Refreshing...',
		onRefresh: () => window.location.reload(),
	});

	connectToServer();
});

const connectToServer = () => {
	ws = new WebSocket(`ws://${window.location.host}`, 'echo-protocol');

	ws.onmessage = (event) => {
		const data = JSON.parse(event.data);

		if (data.type == 'response') {
			result.Device = data.payload.Device;
			result.Battery = data.payload.Battery;
			result.Grid = data.payload.Grid;
			result.L1 = data.payload.L1;
			result.L2 = data.payload.L2;
			result.Output = data.payload.Output;
		}

		if (data.type == 'response:power') {
			historyPower.l1 = data.payload.map(value => value.l1);
			historyPower.l2 = data.payload.map(value => value.l2);
		}

		if (data.type == 'response:consumption') {
			historyPower.consumption = data.payload;
		}
	};

	ws.onopen = () => {
		ws.send(JSON.stringify({ type: 'get:power' }));

		ws.send(JSON.stringify({
			type: 'get:consumption',
			format: 'month',
		}));
	};
};

const batteryColor = computed(() => {
	if (['In Use', 'Discharging'].includes(result.Battery?.State)) {
		return result.Device?.Sunlight ? 'green' : 'orange';
	}

	if (result.Battery?.State == 'Charging') {
		return 'green';
	}

	return '';
});

const scaleValue = (value, fixed = 1) => {
	const num = parseInt(value);

	if (num >= 1000) {
		return `${(num * 0.001).toFixed(fixed)}k`;
	}

	return Math.round(value);
};

const onFilter = (value) => {
	ws.send(JSON.stringify({
		type: 'get:consumption',
		format: value,
	}));
};
</script>

<template>
	<header>
		<TopAnimation :solar="result.Device.Sunlight" />

		<div class="wrapper">
			<h4>{{ result.Device.WorkState || 'Energy' }}</h4>

			<div class="stat-box" v-if="result.Output.Power">
				<h3>{{ scaleValue(result.Output.Power, 2) }}w</h3>
				<p><span>{{ result.Output.LoadPercent }}%</span> Home Load</p>
			</div>

			<SmartHome :grid-state="result.Grid.State" :device-state="result.Device.WorkState"
				:battery-state="result.Battery.State" :solar="result.Device.Sunlight"></SmartHome>
		</div>
	</header>

	<main>
		<transition>
			<StatusBadge color="red" v-if="result.Device.SystemFault">
				<template #icon>
					<img src="./assets/fault.png" alt="" width="24">
				</template>
				<template #heading>{{ result.Device.SystemFault }}</template>
			</StatusBadge>
		</transition>

		<transition>
			<StatusBadge :color="batteryColor" v-if="result.Battery.SocPercent">
				<template #icon>
					<BatteryIcon :percent="result.Battery.SocPercent"></BatteryIcon>
				</template>
				<template #heading>{{ result.Battery.State }}</template>
				{{ result.Battery.SocPercent }}%
			</StatusBadge>
		</transition>

		<transition>
			<StatusBadge v-if="result.Grid.State">
				<template #icon>
					<GridIcon :active="result.Grid.State == 'Connected'"></GridIcon>
				</template>
				<template #heading>{{ result.Grid.State }}</template>
				{{ Math.round(result.Grid.Voltage) }}v / {{ Math.round(result.Grid.Frequency) }}Hz
			</StatusBadge>
		</transition>

		<transition>
			<div class="row" v-if="result.L1.Power || result.L2.Power">
				<ChartBadge :data="historyPower.l1">
					<template #title>Line1</template>
					<template #description>{{ result.L1.Voltage }}v</template>
					{{ scaleValue(result.L1.Power) }}W
				</ChartBadge>
				<ChartBadge :data="historyPower.l2">
					<template #title>Line2</template>
					<template #description>{{ result.L2.Voltage }}v</template>
					{{ scaleValue(result.L2.Power) }}W
				</ChartBadge>
			</div>
		</transition>

		<transition>
			<DataChartBadge v-if="result.Device.WorkState && historyPower.consumption" :data="historyPower.consumption"
				v-on:filter="onFilter">
				<template #title>Consumption</template>
				{{ scaleValue(historyPower.consumption?.total) }}W
				<p class="stats-icon">
					<span><img src="./assets/grid.png" alt="" width="12" height="12"> {{
						scaleValue(historyPower.consumption?.grid) }}W</span>
					<span><img src="./assets/battery_5.png" alt="" width="12" height="12"> {{
						scaleValue(historyPower.consumption?.battery) }}W</span>
				</p>
			</DataChartBadge>
		</transition>
	</main>

	<footer>
		Made with ☕️ by <a href="https://github.com/joshepw">@joshepw</a> - Copyright {{ (new Date()).getFullYear() }}
	</footer>
</template>

<style scoped>
.icon-indicator {
	background-color: #2F3251;
	border-radius: 50%;
	display: flex;
	padding: 1rem;
	position: absolute;
	top: 0;
	right: 0;
	z-index: 999;
}

.wrapper h4 {
	font-size: 1.2rem;
	flex: 1;
	margin-bottom: 0.5rem;
}

.wrapper .stat-box h3 {
	font-size: 2.5rem;
	margin: 0;
	padding: 0;
	line-height: 1.1em;
}

.wrapper .stat-box p {
	opacity: 0.8;
}

main {
	padding-top: 1rem;
}

main .row {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
}

main .chart-item .stats-icon {
	font-size: 12px;
	display: flex;
	line-height: 1em;
}

main .chart-item .stats-icon span {
	display: flex;
	align-items: center;
	justify-content: center;
}

main .chart-item .stats-icon img {
	display: inline-block;
	margin-left: 0.75rem;
	margin-right: 0.2rem;
}

footer {
	padding: 1rem;
	font-size: 14px;
	opacity: 0.7;
	text-align: center;
}

.v-enter-active,
.v-leave-active {
	transition: 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
