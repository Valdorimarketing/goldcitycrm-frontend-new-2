<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                Yeni Aksiyon Ekle
              </DialogTitle>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Planned Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Planlanan Tarih
                  </label>
                  <div class="flex space-x-2">
                    <select
                      v-model="form.dateType"
                      class="input-primary flex-1"
                      required
                    >
                      <option value="before">Önce</option>
                      <option value="after">Sonra</option>
                    </select>
                    <input
                      v-model.number="form.days"
                      type="number"
                      min="1"
                      placeholder="Gün"
                      class="input-primary flex-1"
                      required
                    />
                  </div>
                </div>

                <!-- Name -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Aksiyon Adı
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="input-primary"
                    placeholder="Aksiyon adını girin"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="4"
                    required
                    class="input-primary"
                    placeholder="Aksiyon açıklamasını girin"
                  />
                </div>

                <!-- Error Message -->
                <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                  <p class="text-sm text-red-800 dark:text-red-400">{{ error }}</p>
                </div>

                <!-- Buttons -->
                <div class="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    @click="closeModal"
                    class="btn-secondary"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="btn-primary"
                  >
                    <span v-if="loading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </span>
                    <span v-else>Kaydet</span>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import type { CreateActionListDto } from '~/types'

const props = defineProps<{
  isOpen: boolean
  productId: string
}>()

const emit = defineEmits<{
  close: []
  created: [action: any]
}>()

const actionListsStore = useActionListsStore()
const authStore = useAuthStore()

const form = ref({
  dateType: 'after' as 'before' | 'after',
  days: 1,
  name: '',
  description: ''
})

const loading = ref(false)
const error = ref('')

const closeModal = () => {
  form.value = {
    dateType: 'after',
    days: 1,
    name: '',
    description: ''
  }
  error.value = ''
  emit('close')
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const plannedDate = form.value.dateType === 'before' 
      ? -form.value.days 
      : form.value.days

    const actionData: CreateActionListDto = {
      user: authStore.user?.id || 0,
      product: parseInt(props.productId),
      plannedDate,
      name: form.value.name,
      description: form.value.description
    }

    const newAction = await actionListsStore.createActionList(actionData)
    emit('created', newAction)
    closeModal()
  } catch (err: any) {
    error.value = err.data?.message || 'Aksiyon eklenirken bir hata oluştu'
  } finally {
    loading.value = false
  }
}
</script>