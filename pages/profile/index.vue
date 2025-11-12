<template>
  <div class="flex justify-center items-center min-h-[80vh] bg-gray-50 dark:bg-gray-900 px-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
      <!-- Avatar -->
      <div class="flex justify-center mb-4">
        <div class="relative">
          <img
            v-if="authStore.user?.avatar"
            :src="path + authStore.user.avatar"
            alt="Avatar"
            class="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-md"
          />
          <div
            v-else
            class="w-28 h-28 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-indigo-500 shadow-md"
          >
            {{ authStore.user?.name?.charAt(0) || 'U' }}
          </div>
        </div>
      </div>

      <!-- Ad Soyad -->
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
        {{ authStore.user?.name || 'Bilinmeyen Kullanıcı' }}
      </h2>

      <!-- Rol -->
      <p class="text-indigo-500 dark:text-indigo-400 mb-1">
        {{ authStore.user?.role || 'Rol Belirtilmemiş' }}
      </p>

      <!-- mail -->
      <p class="text-gray-500 dark:text-gray-300">
        {{ authStore.user?.email || '-' }}
      </p>

      
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/tr'

const authStore = useAuthStore()
const config = useRuntimeConfig()
const path = config.public.apiBase

const formatDate = (date) => {
  if (!date) return '-'
  return dayjs(date).locale('tr').format('DD MMMM YYYY')
}
</script>
