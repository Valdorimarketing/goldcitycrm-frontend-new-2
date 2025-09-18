<template>
  <div class="login-container flex items-center justify-center">
    <div class="w-full max-w-md">
      <div class="card">
        <!-- Logo/Title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Valdori CRM</h1>
          <p class="text-gray-600">Yeni hesap oluşturun</p>
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name Input -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Ad Soyad
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="form-input"
              placeholder="Adınız ve soyadınız"
              :disabled="loading"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              placeholder="ornek@email.com"
              :disabled="loading"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              placeholder="En az 6 karakter"
              :disabled="loading"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Role Input -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              id="role"
              v-model="form.role"
              class="form-input"
              :disabled="loading"
            >
              <option value="">Rol seçin</option>
              <option value="admin">Yönetici</option>
              <option value="manager">Müdür</option>
              <option value="employee">Çalışan</option>
            </select>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-sm text-red-800">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kayıt oluşturuluyor...
            </span>
            <span v-else>Kayıt Ol</span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Zaten hesabınız var mı?
            <NuxtLink to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">
              Giriş yapın
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: false
})

// Auth store
const authStore = useAuthStore()

// Reactive form data
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: ''
})

// Form validation errors
const errors = reactive({
  name: '',
  email: '',
  password: '',
  role: ''
})

// Loading state and error message
const loading = ref(false)
const errorMessage = ref('')

// Validate form
const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.role = ''
  
  if (!form.name.trim()) {
    errors.name = 'Ad soyad gereklidir'
    return false
  }
  
  if (!form.email) {
    errors.email = 'E-posta adresi gereklidir'
    return false
  }
  
  if (!form.email.includes('@')) {
    errors.email = 'Geçerli bir e-posta adresi girin'
    return false
  }
  
  if (!form.password) {
    errors.password = 'Şifre gereklidir'
    return false
  }
  
  if (form.password.length < 6) {
    errors.password = 'Şifre en az 6 karakter olmalıdır'
    return false
  }
  
  return true
}

// Handle register
const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const success = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role || 'employee'
    })
    
    if (success) {
      await navigateTo('/dashboard')
    } else {
      errorMessage.value = 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.'
    }
  } catch (error) {
    console.error('Register error:', error)
    errorMessage.value = 'Bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

// Check if already logged in
onMounted(() => {
  if (authStore.isLoggedIn) {
    navigateTo('/dashboard')
  }
})
</script> 