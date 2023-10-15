<template>
  <div
    id="modal"
    class="no-scrollbar fixed z-50 inset-0 overflow-y-auto transition-all duration-1000"
    :class="{ 'w-full': showAddModal, 'w-0': !showAddModal }"
    @click="closeModal"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 transition-opacity transition-all duration-1000"
        :class="{ 'w-full': showAddModal, 'w-0': !showAddModal }"
      >
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-start sm:h-screen">&#8203;</span>
      <div
        @click.stop="doNothing"
        class="inline-block float-left align-start bg-white rounded-tr-xl rounded-br-xl text-left overflow-y-auto transform transition-all duration-300 sm:align-start sm:max-w-md absolute left-0 top-0"
        :class="{ 'w-full': showAddModal, 'w-0': !showAddModal }"
      >
        <div class="p-2 px-4">
          <div
            class="modal-close text-lg text-gray-500 text-right cursor-pointer z-50 float-right"
            @click="closeModal"
          >
            <i class="fas fa-times"></i>
          </div>
          <div class="p-3">
            <div class="text-3xl">
              <div class="">
                <span
                  class="absolute top-3 left-9 w-6 h-6 px-2.5 z-10 rounded-full bg-emerald-600"
                ></span>
                <span
                  class="absolute top-4 left-4 w-8 h-8 px-2.5 z-10 rounded-full bg-emerald-400"
                ></span>
                <span class="absolute px-2.5 py-1 rounded-full bg-emerald-200 z-20">
                  <i class="fa fa-check text-4xl animate-bounce w-6 h-6"></i>
                </span>
              </div>
              <span class="pl-12 font-bold text-2xl">Add New Task</span>
            </div>
          </div>

          <div class="p-3">
            <vee-form @submit="addTask" :validation-schema="schema">
              <label class="block text-gray-500 mb-2">1. Add task text: </label>
              <vee-field
                as="textarea"
                class="border w-full p-2 focus:border"
                name="task_text"
                rows="2"
              />
              <ErrorMessage class="text-red-500 text-xs" name="task_text" />

              <label class="block text-gray-500 mb-2 mt-5">2. Set deadline for task: </label>
              <VueDatePicker
                v-model="date"
                auto-apply
                partial-flow
                :flow="['calendar', 'time']"
                :min-date="startDate"
                :start-date="startDate"
                :monthChangeOnScroll="false"
                :inline="true"
                class="mb-5"
              ></VueDatePicker>
              <div :class="{ hidden: date == null }">
                <label class="block">
                  Your picked date and time :
                  <span class="font-bold">{{ processedDate }}</span></label
                >
                <vee-field type="checkbox" class="" value="1" name="task_date" />
                <label class="pl-2 inline-block">Are you sure?</label>
              </div>
              <ErrorMessage class="text-red-500 text-xs block" name="task_date" />
              <button
                type="submit"
                class="block m-auto mt-8 w-1/2 bg-emerald-500 text-white py-1.5 px-3 rounded-full transition"
              >
                Add task
              </button>
            </vee-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'

const $swal = inject('$swal')
const props = defineProps({ showAddModal: Boolean, addToTasks: Function })
const emit = defineEmits(['showAddModal'])
const date = ref(null)
const startDate = ref(new Date())
const schema = ref({
  task_text: 'required',
  task_date: 'required'
})

const processedDate = computed(() => {
  if (!date.value) return
  const splitDate = date.value.toString().split(' ')
  return `${splitDate[2]} ${splitDate[1]} ${splitDate[3]} , ${splitDate[4]}`
})

function closeModal() {
  emit('showAddModal')
}

function doNothing() {}
function addTask(values, { resetForm }) {
  const task = {
    text: values.task_text,
    date: date.value.toString(),
    done: false,
    dead: false
  }
  closeModal()
  props.addToTasks(task)
  resetForm()
  startDate.value = new Date()
  $swal('Task Added!', '', 'success')
}
</script>
