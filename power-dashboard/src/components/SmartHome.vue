import { computed } from 'vue';
<script setup>
import { computed } from 'vue';

const props = defineProps({
	deviceState: String,
	gridState: String,
	batteryState: String,
	solar: Boolean,
});

const battery = computed(() => {
	if (!props.batteryState) {
		return null;
	}

	if (['In Use', 'Discharging'].includes(props.batteryState)) {
		return props.solar ? 'both' : 'load';
	}

	if (props.batteryState == 'Charging') {
		return 'charge';
	}

	return 'standby';
});
</script>

<template>
	<svg id="sweethome" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 368.61 269.35">
		<g>
			<polygon fill="#dfe1dd" points="323.93 133.21 339.09 123.56 354.1 132.22 338.56 141.68 323.93 133.21" />
			<polygon class="cls-16" points="323.93 203.11 323.93 133.21 338.56 141.68 338.56 211.56 323.93 203.11" />
			<polygon class="cls-5"
				points="354.1 132.22 338.56 141.68 338.56 211.56 354.1 202.87 354.1 141.06 354.1 132.22" />
		</g>
		<transition>
			<g id="grid" v-if="gridState == 'Connected'">
				<g>
					<g>
						<polygon class="cls-12"
							points="342.93 148.55 354.08 142.11 356.31 143.39 345.03 149.76 342.93 148.55" />
						<polygon fill="#7883c0"
							points="342.93 161.43 342.93 148.55 345.03 149.76 345.03 162.64 342.93 161.43" />
						<polygon fill="#4654a4"
							points="356.31 143.39 345.03 149.76 345.03 162.64 356.31 156.27 356.31 143.39" />
					</g>
					<g>
						<polygon class="cls-13" points="349.02 146.3 351.33 145 351.33 115.44 349.13 116.7 349.02 146.3" />
						<polygon class="cls-14"
							points="349.02 146.3 347.91 145.59 347.91 115.88 349.13 116.7 349.02 146.3" />
						<polygon class="cls-15"
							points="349.13 116.7 347.91 115.88 350.17 114.77 351.33 115.44 349.13 116.7" />
					</g>
					<path id="grid-cable" class="cls-2" d="M367.03,125.77l-81.33-46.96s-8.42-5.2-16.89,0" />
				</g>

				<circle v-if="deviceState == 'Power Line'" r="4" cx="360" cy="121.7" fill="#4654a4" class="circle" />
			</g>
		</transition>
		<transition>
			<g v-if="gridState == 'Offline'">
				<g transform="translate(10 -5)">
					<rect fill="#1f243b" x="303.03" y="103.86" width="47.92" height="16.85" rx="4.66" ry="4.66" />
					<path fill="#7985c1"
						d="M346.28,121.72h-38.59c-3.12,0-5.66-2.54-5.66-5.66v-7.52c0-3.12,2.54-5.66,5.66-5.66h38.59c3.12,0,5.66,2.54,5.66,5.66v7.52c0,3.12-2.54,5.66-5.66,5.66Zm-38.59-16.85c-2.02,0-3.66,1.64-3.66,3.66v7.52c0,2.02,1.64,3.66,3.66,3.66h38.59c2.02,0,3.66-1.64,3.66-3.66v-7.52c0-2.02-1.64-3.66-3.66-3.66h-38.59Z" />
				</g>
				<g transform="translate(10 -5)">
					<path fill="#dddfe8"
						d="M309.57,115.57c-.36-.19-.64-.46-.83-.81-.2-.35-.29-.75-.29-1.22v-2.52c0-.46,.1-.87,.29-1.22,.2-.35,.48-.62,.83-.81,.36-.19,.78-.29,1.25-.29s.89,.1,1.26,.29c.36,.19,.64,.46,.84,.81,.2,.35,.3,.75,.3,1.22v2.52c0,.46-.1,.87-.3,1.22-.2,.35-.48,.62-.84,.81-.36,.19-.78,.29-1.26,.29s-.89-.1-1.25-.29Zm2.47-.78c.31-.31,.46-.71,.46-1.22v-2.56c0-.51-.15-.92-.46-1.23s-.71-.46-1.22-.46-.9,.15-1.21,.46-.46,.72-.46,1.23v2.56c0,.51,.15,.91,.46,1.22,.31,.31,.71,.46,1.21,.46s.91-.15,1.22-.46Z" />
					<path fill="#dddfe8"
						d="M319.3,109.4h-3.67s-.04,.01-.04,.04v2.47s.01,.04,.04,.04h2.57c.07,0,.1,.03,.1,.1v.42c0,.07-.03,.1-.1,.1h-2.57s-.04,.01-.04,.04v3.07c0,.07-.03,.1-.1,.1h-.51c-.07,0-.1-.03-.1-.1v-6.8c0-.07,.03-.1,.1-.1h4.32c.07,0,.1,.03,.1,.1v.42c0,.07-.03,.1-.1,.1Z" />
					<path fill="#dddfe8"
						d="M324.98,109.4h-3.67s-.04,.01-.04,.04v2.47s.01,.04,.04,.04h2.57c.07,0,.1,.03,.1,.1v.42c0,.07-.03,.1-.1,.1h-2.57s-.04,.01-.04,.04v3.07c0,.07-.03,.1-.1,.1h-.51c-.07,0-.1-.03-.1-.1v-6.8c0-.07,.03-.1,.1-.1h4.32c.07,0,.1,.03,.1,.1v.42c0,.07-.03,.1-.1,.1Z" />
					<path fill="#dddfe8"
						d="M326.24,115.68v-6.8c0-.07,.03-.1,.1-.1h.51c.07,0,.1,.03,.1,.1v6.24s.01,.04,.04,.04h3.53c.07,0,.1,.03,.1,.1v.42c0,.07-.03,.1-.1,.1h-4.18c-.07,0-.1-.03-.1-.1Z" />
					<path fill="#dddfe8"
						d="M331.92,115.68v-6.8c0-.07,.03-.1,.1-.1h.51c.07,0,.1,.03,.1,.1v6.8c0,.07-.03,.1-.1,.1h-.51c-.07,0-.1-.03-.1-.1Z" />
					<path fill="#dddfe8"
						d="M338.78,108.78h.51c.07,0,.1,.03,.1,.1v6.8c0,.07-.03,.1-.1,.1h-.5s-.09-.02-.12-.07l-3.41-5.55s-.02-.03-.03-.02c-.01,0-.02,.02-.02,.04v5.51c.01,.07-.02,.1-.09,.1h-.51c-.07,0-.1-.03-.1-.1v-6.8c0-.07,.03-.1,.1-.1h.5s.09,.02,.12,.07l3.41,5.55s.02,.03,.03,.02c.01,0,.02-.02,.02-.04v-5.51c0-.07,.02-.1,.09-.1Z" />
					<path fill="#dddfe8"
						d="M345.56,109.4h-3.68s-.04,.01-.04,.04v2.47s.01,.04,.04,.04h2.58c.07,0,.1,.03,.1,.1v.42c0,.07-.03,.1-.1,.1h-2.58s-.04,.01-.04,.04v2.51s.01,.04,.04,.04h3.68c.07,0,.1,.03,.1,.1v.42c0,.07-.03,.1-.1,.1h-4.33c-.07,0-.1-.03-.1-.1v-6.8c0-.07,.03-.1,.1-.1h4.33c.07,0,.1,.03,.1,.1v.42c0,.07-.03,.1-.1,.1Z" />
				</g>
			</g>
		</transition>
		<transition>
			<g v-if="gridState == 'Warning'">
				<g transform="translate(10 -10)">
					<path fill="#ecb541"
						d="M333.97,75.8c.93-1.61,3.25-1.61,4.17,0l5.81,10.06,5.81,10.06c.93,1.61-.23,3.61-2.09,3.61h-23.23c-1.85,0-3.01-2.01-2.09-3.61l5.81-10.06,5.81-10.06Z" />
					<path fill="#d2962b"
						d="M347.68,100.54h-23.23c-1.23,0-2.34-.64-2.95-1.7s-.62-2.34,0-3.41l11.62-20.12c.62-1.07,1.72-1.71,2.95-1.71h0c1.23,0,2.34,.64,2.95,1.7l11.62,20.12c.62,1.07,.62,2.34,0,3.41-.62,1.07-1.72,1.7-2.95,1.7Zm-11.62-24.94h0c-.51,0-.96,.26-1.22,.7h0s-11.62,20.12-11.62,20.12c-.25,.44-.25,.97,0,1.41s.71,.7,1.22,.7h23.23c.51,0,.97-.26,1.22-.7,.25-.44,.25-.97,0-1.41l-11.62-20.12c-.25-.44-.71-.7-1.22-.7Z" />
					<rect class="cls-7" x="334.62" y="80.19" width="2.88" height="11.44" rx="1.44" ry="1.44" />
					<rect class="cls-7" x="334.62" y="93.06" width="2.88" height="2.88" rx="1.44" ry="1.44" />
				</g>
			</g>
		</transition>
		<g id="home">
			<polygon class="cls-16" points="18.04 70.65 18.04 176.62 178.63 269.35 178.63 163.37 18.04 70.65" />
			<polygon class="cls-5" points="247.46 123.63 178.63 163.37 178.63 269.35 247.46 229.61 247.46 123.63" />
			<polygon fill="#dfe1dd"
				points="270.4 75.06 216.87 105.97 247.46 123.63 178.63 163.37 18.04 70.65 140.4 0 247.46 61.82 247.46 61.82 270.4 75.06" />
			<polygon class="cls-4"
				points="178.63 221.7 209.22 204.04 209.22 230.53 178.63 248.19 140.4 226.11 140.4 199.62 178.63 221.7" />
			<polyline class="cls-16"
				points="255.11 75.06 201.58 105.97 232.16 123.63 178.63 154.54 33.34 70.65 139.97 8.83" />
			<polygon fill="#9b9a9a" points="140.4 17.42 40.98 75.06 33.34 70.65 139.97 8.83 140.4 17.42" />
			<polygon class="cls-15" points="139.97 8.83 140.4 17.42 247.46 79.48 255.11 75.06 139.97 8.83" />
			<polygon class="cls-15" points="201.58 105.97 201.58 114.8 224.52 128.05 232.16 123.63 201.58 105.97" />
			<polygon class="cls-6"
				points="270.75 75.06 216.52 105.97 247.11 123.63 247.46 194.48 270.75 181.04 270.75 75.06" />
			<polygon class="cls-7"
				points="300.99 119.22 300.99 199.62 285.7 207.53 285.7 145.71 193.93 198.7 193.93 181.04 300.99 119.22" />
			<polygon class="cls-16" points="285.7 207.53 278.05 203.11 278.05 150.13 285.7 145.71 285.7 207.53" />
			<polygon class="cls-16" points="193.93 181.04 186.28 176.62 186.63 194.48 193.93 198.7 193.93 181.04" />
			<polygon fill="#dfe1dd"
				points="247.2 141.15 186.28 176.62 193.93 181.04 300.99 119.22 270.75 101.76 239.46 119.22 247.11 123.63 247.2 141.15" />
			<polygon class="cls-16"
				points="263.2 105.97 285.7 119.22 247.2 141.15 247.11 123.63 239.46 119.22 263.2 105.97" />
			<polygon class="cls-10" points="263.2 105.97 263.2 115.06 247.11 123.63 239.46 119.22 263.2 105.97" />
			<polygon class="cls-15" points="277.92 123.56 285.7 119.22 263.2 105.97 263.2 115.06 277.92 123.56" />
			<polygon class="cls-11"
				points="247.46 229.61 285.7 207.53 278.05 203.11 278.05 185.45 270.75 181.04 247.46 194.48 247.46 229.61" />
			<polygon class="cls-9" points="278.05 203.11 270.75 181.04 270.75 181.04 278.05 185.45 278.05 203.11" />
			<g>
				<polygon fill="#7e8389" points="253.52 154.47 253.52 158.96 257.41 156.71 257.41 152.37 253.52 154.47" />
				<polygon fill="#717477" points="253.52 154.47 251.33 153.19 251.33 157.73 253.52 158.96 253.52 154.47" />
				<polygon fill="#959ba0" points="257.41 152.37 253.52 154.47 251.33 153.19 255.06 151.05 257.41 152.37" />
			</g>
			<g>
				<polygon fill="#7e8389" points="269.9 145.17 269.9 149.66 273.79 147.42 273.79 143.08 269.9 145.17" />
				<polygon fill="#717477" points="269.9 145.17 267.71 143.9 267.71 148.44 269.9 149.66 269.9 145.17" />
				<polygon fill="#959ba0" points="273.79 143.08 269.9 145.17 267.71 143.9 271.44 141.76 273.79 143.08" />
			</g>
			<g>
				<polygon fill="#7e8389" points="284.85 137.19 284.85 141.68 288.73 139.43 288.73 135.09 284.85 137.19" />
				<polygon fill="#717477" points="284.85 137.19 282.66 135.91 282.66 140.45 284.85 141.68 284.85 137.19" />
				<polygon fill="#959ba0" points="288.73 135.09 284.85 137.19 282.66 135.91 286.38 133.77 288.73 135.09" />
			</g>
		</g>
		<transition>
			<g id="solar" v-if="solar">
				<g>
					<polygon fill="#4654a4" points="47.77 75.06 140.4 21.58 170.99 39.24 78.36 92.73 47.77 75.06" />
					<polygon fill="#293c7f"
						points="47.77 75.06 47.77 76.06 78.34 93.71 170.99 40.41 170.99 39.24 78.36 92.73 47.77 75.06" />
				</g>
				<g>
					<polygon fill="#4654a4" points="82.61 94.63 175.24 41.14 205.83 58.8 113.2 112.29 82.61 94.63" />
					<polygon fill="#293c7f"
						points="82.61 94.63 82.61 95.62 113.19 113.27 205.83 59.98 205.83 58.8 113.2 112.29 82.61 94.63" />
				</g>
				<g>
					<path id="solar-cable" class="cls-2" d="M170.99,118.73l15.29,9.32s5.22,2.89,5.22,7.43" />
					<polygon fill="#293c7f"
						points="117.02 114.56 117.02 115.56 147.6 133.21 240.24 79.91 240.24 78.74 147.61 132.22 117.02 114.56" />
					<polygon fill="#4654a4" points="117.02 114.56 209.65 61.08 240.24 78.74 147.61 132.22 117.02 114.56" />
				</g>
				<circle r="4" cx="170" cy="118" fill="#4654a4" class="circle" />
			</g>
		</transition>
		<transition>
			<g id="battery" v-if="battery">
				<g>
					<polygon fill="#7883c0" points="25.69 189.19 25.69 136.86 86.87 171.53 86.87 224.51 25.69 189.19" />
					<polygon fill="#c5c9e6" points="33.34 132.25 25.69 136.86 86.87 171.53 94.51 167.11 33.34 132.25" />
					<polygon fill="#4654a4" points="94.51 220.1 94.51 167.11 86.87 171.53 86.87 224.51 94.51 220.1" />
					<polygon class="cls-12"
						points="57.38 168.87 48.63 182.12 54.69 182.12 53 191.84 62.42 177.7 56.31 177.7 57.38 168.87" />
					<path id="battery-cable" class="cls-2" d="M60.03,150.55v-26.49s-.38-4.42,4.81-4.42" />
				</g>
				<circle r="4" cx="60" cy="148" fill="#4654a4" class="circle" :class="[battery]" />
			</g>
		</transition>
	</svg>
</template>

<style scoped>
@keyframes grid-circle {
	0% {
		opacity: 0;
	}

	10% {
		opacity: 1;
	}

	90% {
		transform: translate(-73px, -42.2px);
		opacity: 1;
	}

	100% {
		transform: translate(-73px, -42.2px);
		opacity: 0;
	}
}

@keyframes solar-circle {
	0% {
		opacity: 0;
	}

	10% {
		opacity: 1;
	}

	90% {
		transform: translate(18px, 11px);
		opacity: 1;
	}

	100% {
		transform: translate(18px, 11px);
		opacity: 0;
	}
}

@keyframes battery-circle {
	0% {
		opacity: 0;
	}

	10% {
		opacity: 1;
	}

	90% {
		transform: translateY(-24px);
		opacity: 1;
	}

	100% {
		transform: translateY(-24px);
		opacity: 0;
	}
}

#grid .circle {
	animation-name: grid-circle;
	animation-duration: 2s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}

#solar .circle {
	animation-name: solar-circle;
	animation-duration: 2s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}

#battery .circle {
	opacity: 0;
	animation-duration: 2s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}

#battery .circle.load {
	animation-name: battery-circle;
}

#battery .circle.charge {
	animation-name: battery-circle;
	animation-direction: reverse !important;
}

#battery .circle.both {
	animation-name: battery-circle;
	animation-direction: alternate !important;
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

.cls-2 {
	fill: none;
	stroke: #4654a4;
}

.cls-2,
.cls-3,
.cls-4 {
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-width: 3px;
}

.cls-5 {
	fill: #f0efef;
}

.cls-6 {
	fill: #eaeaea;
}

.cls-7 {
	fill: #f4f4f5;
}

.cls-9 {
	fill: #a09f9f;
}

.cls-10 {
	fill: #b7b7b7;
}

.cls-11 {
	fill: #c2c1c0;
}

.cls-12 {
	fill: #c2c8e6;
}

.cls-13 {
	fill: #bababa;
}

.cls-14 {
	fill: #939393;
}

.cls-15 {
	fill: #aeadae;
}

.cls-16 {
	fill: #d2d2d1;
}

.cls-4 {
	fill: #484847;
	opacity: .5;
	stroke: #7e8389;
}</style>