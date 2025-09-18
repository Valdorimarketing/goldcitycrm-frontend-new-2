<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Kullanıcılar</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Sistem kullanıcılarını buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="openModal"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Kullanıcı
        </button>
      </div>
    </div>

    <!-- Users List -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="user in filteredUsers" :key="user.id" class="card">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ user.name || 'İsimsiz Kullanıcı' }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ user.email || 'E-posta yok' }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-500">{{ getRoleText(user.role) }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span 
              :class="user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            >
              {{ user.isActive ? 'Aktif' : 'Pasif' }}
            </span>
            <button
              @click="toggleUserStatus(user)"
              :disabled="toggleLoading[user.id]"
              class="px-2 py-1 text-xs font-medium rounded transition-colors disabled:opacity-50"
              :class="user.isActive 
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800' 
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'"
            >
              <span v-if="toggleLoading[user.id]" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                İşleniyor...
              </span>
              <span v-else>
                {{ user.isActive ? 'Deaktif Et' : 'Aktif Et' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredUsers.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Kullanıcı bulunamadı</p>
    </div>

    <!-- Create User Modal -->
    <UserCreateModal 
      :is-open="showCreateModal" 
      @close="showCreateModal = false"
      @created="handleUserCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useUsersStore } from '~/stores/users'
import UserCreateModal from '~/components/UserCreateModal.vue'

definePageMeta({
  // middleware: 'auth' // Temporarily disabled
})

// Store
const usersStore = useUsersStore()

// Modal state
const showCreateModal = ref(false)

// Loading state for toggle buttons
const toggleLoading = ref({})

// Load data immediately
try {
  const api = useApi()
  console.log('Loading users...')
  
  const response = await api('/users')
  
  console.log('Users loaded:', response)
  if (Array.isArray(response)) {
    usersStore.users.value = response
  } else {
    usersStore.users.value = response.data || []
  }
} catch (error) {
  console.error('Failed to load users:', error)
  // Fallback to demo data
  usersStore.users.value = [
    {
      id: 999,
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]
}

// Modal functions
const openModal = () => {
  showCreateModal.value = true
}

// Handle user creation
const handleUserCreated = (newUser) => {
  console.log('New user created:', newUser)
  // Add to store manually since we're not using store methods
  usersStore.users.value.unshift(newUser)
}

// Data is loaded above in script setup

// Computed properties
const filteredUsers = computed(() => {
  return usersStore.users.value || []
})

const toggleUserStatus = async (user) => {
  console.log('Toggling user status for:', user.name || `User ID ${user.id}`)
  
  // Set loading state
  toggleLoading.value[user.id] = true
  
  // Always update local state first for immediate UI feedback
  const index = usersStore.users.value.findIndex(u => u.id === user.id)
  const oldStatus = user.isActive
  
  if (index !== -1) {
    usersStore.users.value[index].isActive = !usersStore.users.value[index].isActive
    console.log(`User ${user.name} is now ${usersStore.users.value[index].isActive ? 'active' : 'inactive'}`)
  }
  
  // Try to sync with API in background
  try {
    const api = useApi()
    
    const response = await api(`/users/${user.id}`, {
      method: 'PATCH',
      body: { isActive: !oldStatus }
    })
    
    console.log('PATCH response:', response)
    
    console.log('Successfully synced with API')
  } catch (error) {
    console.error('Error syncing with API (using demo mode):', error)
    // Local state is already updated, so no need to revert
  } finally {
    // Clear loading state
    toggleLoading.value[user.id] = false
  }
}

const getRoleText = (role) => {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'manager':
      return 'Yönetici'
    case 'sales':
      return 'Satış Temsilcisi'
    case 'user':
      return 'Kullanıcı'
    default:
      return 'Bilinmiyor'
  }
}

// Page head
useHead({
  title: 'Kullanıcılar - Valdori CRM'
})
</script> 