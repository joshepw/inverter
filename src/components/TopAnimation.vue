<script setup>
defineProps({
	solar: Boolean
})
</script>

<template>
	<transition>
		<div class="sun" v-if="solar"></div>
		<div v-else class="night">
			<div class="star star-1"></div>
			<div class="star star-2"></div>
			<div class="star star-3"></div>
			<div class="moon"></div>
			<div class="shooting-star"></div>
		</div>
	</transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

.sun {
	width: 7rem;
	height: 7rem;
	border-radius: 50%;
	background-color: #FDF6EA;
	display: block;
	margin: 0 auto;
	position: absolute;
	right: 1rem;
	top: 2rem;
	box-shadow: 0 0 0 1rem #FDF6EA10, 0 0 0 2rem #FDF6EA10, 0 0 0 0 #fdf6ea0a;

	animation: sun 6s infinite;
}

@keyframes sun {
	0% {
		box-shadow: 0 0 0 1rem #FDF6EA10, 0 0 0 2rem #FDF6EA10, 0 0 0 0 #fdf6ea0a;
	}
	
	20% {
		box-shadow: 0 0 0 1rem #FDF6EA10, 0 0 0 2rem #FDF6EA10, 0 0 0 6em #fdf6ea00;
	}
	
	25% {
		box-shadow: 0 0 0 1rem #FDF6EA10, 0 0 0 2rem #FDF6EA10, 0 0 0 0 #fdf6ea00;
	}

	100% {
		box-shadow: 0 0 0 1rem #FDF6EA10, 0 0 0 2rem #FDF6EA10, 0 0 0 0 #fdf6ea00;
	}
}

.moon {
  height: 2.2em;
  width: 2.2em;
  background-color: #ffffff;
  position: absolute;
  right: 5em;
  top: 3em;
  border-radius: 50%;
  box-shadow: 0 0 0 0.62em rgba(32, 105, 149, 0.4),
    0 0 0 1.25em rgba(32, 105, 149, 0.2), 0 0 0 1.9em rgba(32, 105, 149, 0.1);
}
.moon:before {
  content: "";
  position: absolute;
  background-color: #ebefe7;
  height: 0.62em;
  width: 0.62em;
  border-radius: 50%;
  top: 0.5em;
  left: 0.37em;
}
.moon:after {
  content: "";
  position: absolute;
  background-color: #ebefe7;
  height: 0.43em;
  width: 0.43em;
  border-radius: 50%;
  top: 1.25em;
  left: 0.75em;
}
.star,
.star:before,
.star:after {
  height: 0.18em;
  width: 0.18em;
  background-color: #ffffff;
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  animation: twinkle 2s infinite;
}
@keyframes twinkle {
  50% {
    opacity: 1;
  }
}
.star-1 {
  top: 5em;
  right: 18.75em;
}
.star-1:before {
  content: "";
  top: 1.9em;
  right: -16.4em;
  animation-delay: 0.3s;
}
.star-1:after {
  content: "";
  right: -12.8em;
  top: 5em;
  animation-delay: 0.7s;
}
.star-2 {
  right: 11.25em;
  top: 3.12em;
  animation-delay: 0.2s;
}
.star-2:before {
  content: "";
  right: 2.5em;
  top: 8.75em;
  animation-delay: 0.9s;
}
.star-2:after {
  content: "";
  right: 7.5em;
  top: 6.25em;
  animation-delay: 0.35s;
}
.star-3 {
  right: 15em;
  top: 1.9em;
  animation-delay: 0.1s;
}
.star-3:before {
  content: "";
  top: 5em;
  right: -0.93em;
}
.shooting-star {
  height: 0.18em;
  width: 2.5em;
  background-color: #ffffff;
  transform: rotate(-30deg);
  position: absolute;
  right: -0.62em;
  opacity: 0.2;
  animation: shooting-str 5s infinite;
}
@keyframes shooting-str {
  10% {
    transform: rotate(-30deg) translate(-34em, 0);
  }
  11% {
	opacity: 0;
  }
  100% {
    transform: rotate(-30deg) translate(-34em, 0);
	opacity: 0;
  }
}
</style>