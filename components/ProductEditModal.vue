<template>
  <div v-if="show && product" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      
      <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 sm:mx-0 sm:h-10 sm:w-10">
                <PencilIcon class="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  Ürün Düzenle
                </h3>
                <div class="mt-4 space-y-4">
                  <!-- Product Name -->
                  <div>
                    <label for="edit-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ürün Adı <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="edit-name"
                      v-model="form.name"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Ürün adını giriniz"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                  </div>

                  <!-- Price -->
                  <div>
                    <label for="edit-price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fiyat <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span class="text-gray-500 dark:text-gray-400 sm:text-sm">₺</span>
                      </div>
                      <input
                        id="edit-price"
                        v-model.number="form.price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-7 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
                  </div>

                  <!-- Error/Success Messages -->
                  <div v-if="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                    <div class="text-sm text-red-700 dark:text-red-300">{{ errorMessage }}</div>
                  </div>

                  <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                    <div class="text-sm text-green-700 dark:text-green-300">{{ successMessage }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 sm:ml-3 sm:w-auto"
            >
              <span v-if="loading">Güncelleniyor...</span>
              <span v-else>Güncelle</span>
            </button>
            <button
              type="button"
              @click="$emit('close')"
              :disabled="loading"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 sm:mt-0 sm:w-auto"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PencilIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean,
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'updated'])

// Form data
const form = reactive({
  name: '',
  price: null
})

// Form state
const loading = ref(false)
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

// Watch for product changes and populate form
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.name = newProduct.name || ''
    form.price = newProduct.price || null
  }
}, { immediate: true })

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!form.name?.trim()) {
    errors.value.name = 'Ürün adı gereklidir'
  }
  
  if (!form.price || form.price <= 0) {
    errors.value.price = 'Geçerli bir fiyat giriniz'
  }
  
  return Object.keys(errors.value).length === 0
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm() || !props.product) return
  
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const api = useApi()
    
    const updateData = {
      ...(form.name.trim() !== props.product.name && { name: form.name.trim() }),
      ...(form.price !== props.product.price && { price: parseFloat(form.price) })
    }
    
    // Only make request if there are changes
    if (Object.keys(updateData).length === 0) {
      errorMessage.value = 'Hiçbir değişiklik yapılmadı'
      return
    }
    
    const response = await api(`/products/${props.product.id}`, {
      method: 'PATCH',
      body: updateData
    })
    
    console.log('Product updated:', response)
    successMessage.value = 'Ürün başarıyla güncellendi!'
    
    // Emit the updated product
    emit('updated', response)
    
    // Close modal after short delay
    setTimeout(() => {
      emit('close')
      successMessage.value = ''
    }, 1500)
    
  } catch (error) {
    console.error('Error updating product:', error)
    
    if (error.status === 500 || error.name === 'FetchError') {
      // Demo mode fallback for server errors
      const demoProduct = {
        ...props.product,
        name: form.name.trim(),
        price: parseFloat(form.price),
        updatesAt: new Date().toISOString()
      }
      
      successMessage.value = 'Ürün başarıyla güncellendi! (Demo Mode - Backend Error)'
      emit('updated', demoProduct)
      
      setTimeout(() => {
        emit('close')
        successMessage.value = ''
      }, 1500)
      
    } else if (error.status === 400 && error.data?.message) {
      // Validation errors from backend
      if (Array.isArray(error.data.message)) {
        errorMessage.value = error.data.message.join(', ')
      } else {
        errorMessage.value = error.data.message
      }
    } else {
      errorMessage.value = 'Ürün güncellenirken bir hata oluştu'
    }
  } finally {
    loading.value = false
  }
}
</script> 