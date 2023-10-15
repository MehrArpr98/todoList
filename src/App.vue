<template>
  <main class="container mx-auto px-4 mb-5 mx-auto max-w-6xl">
    <!-- Add new task button -->
    <button
      role="button"
      aria-label="add-task"
      class="fixed bottom-2 right-2 block z-40 font-2xl text-white border-4 border-white rounded-full bg-emerald-500 w-16 h-16 hover:bg-emerald-600 hover:w-20 hover:h-20 ease-all duration-300"
      @click="showAddModal = true"
    >
      <i class="fa fa-plus"></i>
    </button>

    <!-- Searchbox and options -->
    <div class="border-b flex justify-between py-5">
      <div class="bg-zinc-100 h-10 max-w-sm w-1/2 flex items-center rounded-full border">
        <a id="search-box-icon" class="text-md my-1 pl-3"><i class="fa fa-search"></i></a>
        <input
          type="text"
          placeholder="Search..."
          name="search"
          class="border-0 w-full rounded-full bg-zinc-100 pl-1 focus:border-0 focus:outline-0"
          v-model="searched"
        />
      </div>
      <div class="flex">
        <button
          role="button"
          aria-label="hide-task"
          class="block mx-2 font-2xl h-10 z-40 rounded-full px-3 bg-gray-500 hover:bg-gray-600 text-white ease-all duration-300 flex items-center"
          @click="hideDead = !hideDead"
        >
          <i class="fa fa-times pr-1" v-if="hideDead"></i>
          <i class="fas fa-broom md:hidden inline"></i>
          <span class="hidden md:inline">Hide dead tasks</span>
        </button>
        <button
          role="button"
          aria-label="sort-task"
          class="block font-2xl h-10 z-40 rounded-full px-3 bg-pink-600 hover:bg-pink-700 text-white ease-all duration-300 flex items-center"
          @click="sorted = !sorted"
        >
          <i class="fa fa-times pr-1" v-if="sorted"></i>
          <i class="fa fa-sort-amount-asc md:hidden inline"></i>
          <span class="hidden md:inline"> Sort by deadlin</span>
        </button>
      </div>
    </div>

    <new-task-modal
      :showAddModal="showAddModal"
      @showAddModal="showAddModal = false"
      :addToTasks="addToTasks"
    />

    <!-- Tasks container -->
    <div class="grid-container grid gap-5 my-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div
        id="bg-div"
        :class="{
          short: task.text.length < 50,
          tall: task.text.length < 120 && task.text.length >= 50,
          taller: task.text.length >= 120
        }"
        v-for="(task, index) in filteredTasks"
        :key="task.taskID"
        class="flex items-center justify-center border rounded-lg relative z-10"
      >
        <Task
          :index="index"
          :sorted="sorted"
          :task="task"
          :hideDead="hideDead"
          :removeFromTasks="removeFromTasks"
          :setDeadTasks="setDeadTasks"
          :setDoneTasks="setDoneTasks"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import NewTaskModal from './components/NewTaskModal.vue'
import Task from './components/Task.vue'
import { ref, reactive, computed } from 'vue'

let defaultTasks = reactive([
  {
    date: 'Thu Oct 30 2023 14:00:00 GMT+0330 (Iran Standard Time)',
    dead: false,
    done: false,
    text: 'Putting new skills learned and new implemented projects in the resume',
    taskID: 0
  },
  {
    date: 'Thu dec 05 2023 00:40:00 GMT+0330 (Iran Standard Time)',
    dead: false,
    done: false,
    text: 'Finish mosh hamedani js course',
    taskID: 1
  },
  {
    date: 'Thu oct 29 2023 24:00:00 GMT+0330 (Iran Standard Time)',
    dead: false,
    done: false,
    text: 'View "complete vue developer 2023 zero to mastery(pinia, vitest)" course ',
    taskID: 2
  },
  {
    date: 'Thu nov 05 2023 12:30:00 GMT+0330 (Iran Standard Time)',
    dead: false,
    done: false,
    text: 'Learning and practicing Typescript',
    taskID: 3
  }
])
const todosLists = JSON.parse(localStorage.getItem('todos')) || defaultTasks
const tasks = reactive(todosLists)
const counter = ref(tasks[tasks.length - 1].taskID + 1)
const showAddModal = ref(false)
const searched = ref('')
const sorted = ref(false)
const hideDead = ref(false)

function removeFromTasks(id) {
  tasks.forEach((task, index) => {
    if (task.taskID == id) tasks.splice(index, 1)
  })
  save()
}

function addToTasks(task) {
  const newTask = {
    ...task,
    taskID: counter.value
  }
  tasks.push(newTask)
  counter.value = counter.value + 1
  save()
}

function setDoneTasks(id) {
  tasks.forEach((task) => {
    console.log(1)
    if (task.taskID == id) {
      console.log(2)
      task.done = true
    }
  })
  save()
}

function setDeadTasks(id) {
  tasks.forEach((task) => {
    if (task.taskID == id) task.dead = true
  })
  save()
}

function save() {
  localStorage.setItem('todos', JSON.stringify(tasks))
}

const filteredTasks = computed(() => {
  let temp = [...tasks]

  if (sorted.value) {
    temp = temp.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date)
    })
  } else {
    temp = [...temp]
  }

  if (hideDead.value) {
    temp = temp.filter((item) => {
      return !item.dead
    })
  } else {
    temp = [...temp]
  }

  temp = temp.filter((item) => {
    return item.text.toUpperCase().includes(searched.value.toUpperCase())
  })
  return temp
})
</script>
