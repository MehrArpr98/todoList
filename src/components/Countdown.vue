<template>
  <div class="flex h-10">
    <div id="app-timer" class="container-fluid m-auto text-center">
      <div class="flex items-baseline">
        <span class="text-2xl text-gray-700"><i class="fa fa-clock md:inline hidden"></i></span>
        <template v-for="(time, index) in times" :key="index">
          <div class="">
            <span
              class=""
              :class="{ 'text-3xl md:text-4xl': index == 0, 'text-xl md:text-2xl': index !== 0 }"
            >
              {{ time.time }}
            </span>
            <span v-if="index !== 0 && index !== 3" class="mx-1">:</span>
            <span v-if="index == 0" class="card-footer"> {{ time.text }} , </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  endDate: String
})
const emit = defineEmits('dead')
const times = reactive([
  { id: 0, text: 'Days', time: 1 },
  { id: 1, text: 'Hours', time: 1 },
  { id: 2, text: 'Minutes', time: 1 },
  { id: 3, text: 'Seconds', time: 1 }
])
const progress = ref(100)
const timeinterval = ref(undefined)
const startTime = ref(formatDateTime(new Date().toString()))
const endTime = ref(formatDateTime(props.endDate?.toString()))

updateTimer()
timeinterval.value = setInterval(updateTimer, 1000)

function formatDateTime(date) {
  const splitDate = date.split(' ')
  return `${splitDate[1]} ${splitDate[2]}, ${splitDate[3]} ${splitDate[4]}`
}

function updateTimer() {
  if (times[3].time > 0 || times[2].time > 0 || times[1].time > 0 || times[0].time > 0) {
    getTimeRemaining()
    updateProgressBar()
  } else {
    clearTimeout(timeinterval.value)
    progress.value = 0
    if (times[3].time == 0 && times[2].time == 0 && times[1].time == 0 && times[0].time == 0) {
      emit('dead')
    }
  }
}

function getTimeRemaining() {
  let t = Date.parse(new Date(endTime.value)) - Date.parse(new Date())
  if (t >= 0) {
    times[3].time = Math.floor((t / 1000) % 60) //seconds
    times[2].time = Math.floor((t / 1000 / 60) % 60) //minutes
    times[1].time = Math.floor((t / (1000 * 60 * 60)) % 24) //hours
    times[0].time = Math.floor(t / (1000 * 60 * 60 * 24)) //days
  } else {
    times[3].time = times[2].time = times[1].time = times[0].time = 0
    progress.value = 0
  }
}

function updateProgressBar() {
  let myStartTime = Date.parse(new Date(startTime.value))
  let currentTime = Date.parse(new Date())
  let myEndTime = Date.parse(new Date(endTime.value))
  let interval = parseFloat(
    ((currentTime - myStartTime) / (myEndTime - myStartTime)) * 100
  ).toFixed(2)
  progress.value = 100 - interval
}

watch(
  () => props.endDate,
  (newVal) => {
    endTime.value = formatDateTime(newVal?.toString())
  }
)
</script>
