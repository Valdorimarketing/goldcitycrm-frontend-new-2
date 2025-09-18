<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Hatırlatmalar</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Müşteri notlarındaki hatırlatmaları görüntüleyin.
        </p>
      </div>
    </div>

    <!-- Date Filter -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="dateFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tarih Filtresi
          </label>
          <select
            id="dateFilter"
            v-model="dateFilter"
            @change="handleDateFilterChange"
            class="form-input"
          >
            <option value="today">Bugün ve Öncesi</option>
            <option value="today-only">Sadece Bugün</option>
            <option value="tomorrow">Yarın</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="overdue">Gecikmiş</option>
            <option value="all">Tümü</option>
            <option value="custom">Özel Tarih Aralığı</option>
          </select>
        </div>

        <!-- Custom Date Range -->
        <template v-if="dateFilter === 'custom'">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Başlangıç Tarihi
            </label>
            <input
              id="startDate"
              v-model="customStartDate"
              type="date"
              @change="fetchReminders"
              class="form-input"
            />
          </div>
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bitiş Tarihi
            </label>
            <input
              id="endDate"
              v-model="customEndDate"
              type="date"
              @change="fetchReminders"
              class="form-input"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Reminders List -->
    <div v-else-if="reminders.length > 0" class="space-y-4">
      <div
        v-for="reminder in reminders"
        :key="reminder.id"
        class="card hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- Customer Info -->
            <div class="flex items-center space-x-3 mb-2">
              <UserIcon class="h-5 w-5 text-indigo-600" />
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                <NuxtLink 
                  v-if="reminder.customerInfo"
                  :to="`/customers/${reminder.customer}`"
                  class="hover:text-indigo-600"
                >
                  {{ reminder.customerInfo.name }} {{ reminder.customerInfo.surname }}
                </NuxtLink>
                <span v-else>Müşteri #{{ reminder.customer }}</span>
              </h3>
            </div>

            <!-- Note Content -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
              <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ reminder.note }}</p>
            </div>

            <!-- Meta Info -->
            <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-1">
                <BellIcon class="h-4 w-4" />
                <span>{{ formatDateTime(reminder.remindingAt) }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <ClockIcon class="h-4 w-4" />
                <span>{{ getTimeRemaining(reminder.remindingAt) }}</span>
              </div>
              <div v-if="reminder.userInfo" class="flex items-center space-x-1">
                <UserIcon class="h-4 w-4" />
                <span>{{ reminder.userInfo.name }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col space-y-2 ml-4">
            <button
              @click="markAsCompleted(reminder)"
              class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
              title="Tamamlandı olarak işaretle"
            >
              <CheckIcon class="h-5 w-5" />
            </button>
            <button
              @click="editReminder(reminder)"
              class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
              title="Düzenle"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button
              @click="deleteReminder(reminder)"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              title="Sil"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 card">
      <BellIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Hatırlatma bulunamadı</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Seçilen tarih aralığında hatırlatma bulunmuyor.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BellIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import type { CustomerNote } from '~/types'

// Store
const customerNotesStore = useCustomerNotesStore()
const authStore = useAuthStore()

// State
const loading = ref(false)
const reminders = ref<CustomerNote[]>([])
const dateFilter = ref('today')
const customStartDate = ref('')
const customEndDate = ref('')

// Helper functions
const getTodayDateString = () => {
  // Bugünün tarihini yerel saat dilimine göre al
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getTomorrowDateString = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

const getWeekEndDateString = () => {
  const weekEnd = new Date()
  weekEnd.setDate(weekEnd.getDate() + 7)
  return weekEnd.toISOString().split('T')[0]
}

const getMonthEndDateString = () => {
  const monthEnd = new Date()
  monthEnd.setMonth(monthEnd.getMonth() + 1)
  return monthEnd.toISOString().split('T')[0]
}

// Fetch reminders based on filter
const fetchReminders = async () => {
  loading.value = true
  
  try {
    let filters: any = {
      isReminding: true
    }

    // Aktif kullanıcının ID'sini al ve filtrele
    const currentUserId = authStore.user?.id || useCookie('user-id').value
    if (currentUserId) {
      filters.user = parseInt(currentUserId)
    }

    // Apply date filters using backend's expected format (YYYY-MM-DD)
    switch (dateFilter.value) {
      case 'today':
        // Bugün ve öncesi - çok eski bir tarihten bugüne kadar
        filters.startDate = '2020-01-01'
        filters.endDate = getTodayDateString()
        break
      case 'today-only':
        // Sadece bugün - today parametresi veya startDate=endDate
        filters.today = true
        break
      case 'overdue':
        // Gecikmiş (bugünden öncekiler)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        filters.startDate = '2020-01-01'
        filters.endDate = yesterday.toISOString().split('T')[0]
        break
      case 'tomorrow':
        // Yarının kayıtları (startDate ve endDate aynı)
        const tomorrow = getTomorrowDateString()
        filters.startDate = tomorrow
        filters.endDate = tomorrow
        break
      case 'week':
        // Bu hafta (bugünden hafta sonuna)
        filters.startDate = getTodayDateString()
        filters.endDate = getWeekEndDateString()
        break
      case 'month':
        // Bu ay (bugünden ay sonuna)
        filters.startDate = getTodayDateString()
        filters.endDate = getMonthEndDateString()
        break
      case 'all':
        // Tüm kayıtlar - çok geniş tarih aralığı
        filters.startDate = '2020-01-01'
        filters.endDate = '2030-12-31'
        break
      case 'custom':
        // Özel tarih aralığı
        if (customStartDate.value) {
          filters.startDate = customStartDate.value
        }
        if (customEndDate.value) {
          filters.endDate = customEndDate.value
        }
        break
    }

    await customerNotesStore.fetchCustomerNotes(1, 100, filters)
    reminders.value = customerNotesStore.customerNotes || []
  } catch (error) {
    console.error('Failed to fetch reminders:', error)
    reminders.value = []
  } finally {
    loading.value = false
  }
}

// Handle date filter change
const handleDateFilterChange = () => {
  if (dateFilter.value !== 'custom') {
    customStartDate.value = ''
    customEndDate.value = ''
    fetchReminders()
  }
}

// Mark reminder as completed (remove reminder flag)
const markAsCompleted = async (reminder: CustomerNote) => {
  try {
    await customerNotesStore.updateCustomerNote(reminder.id, {
      isReminding: false
    })
    // Remove from list
    reminders.value = reminders.value.filter(r => r.id !== reminder.id)
  } catch (error) {
    console.error('Failed to mark reminder as completed:', error)
  }
}

// Edit reminder
const editReminder = (reminder: CustomerNote) => {
  // Navigate to customer detail page with note edit modal
  navigateTo(`/customers/${reminder.customer}?editNote=${reminder.id}`)
}

// Delete reminder
const deleteReminder = async (reminder: CustomerNote) => {
  if (!confirm('Bu hatırlatmayı silmek istediğinizden emin misiniz?')) return
  
  try {
    await customerNotesStore.deleteCustomerNote(reminder.id)
    reminders.value = reminders.value.filter(r => r.id !== reminder.id)
  } catch (error) {
    console.error('Failed to delete reminder:', error)
  }
}

// Format date time
const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get time remaining text
const getTimeRemaining = (dateString: string | undefined) => {
  if (!dateString) return ''
  
  const now = new Date()
  const reminderDate = new Date(dateString)
  const diff = reminderDate.getTime() - now.getTime()
  
  if (diff < 0) {
    const hours = Math.abs(Math.floor(diff / (1000 * 60 * 60)))
    if (hours < 24) {
      return `${hours} saat geçti`
    } else {
      const days = Math.floor(hours / 24)
      return `${days} gün geçti`
    }
  } else {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 24) {
      return `${hours} saat kaldı`
    } else {
      const days = Math.floor(hours / 24)
      return `${days} gün kaldı`
    }
  }
}

// Load initial data
onMounted(() => {
  fetchReminders()
})

// Page head
useHead({
  title: 'Hatırlatmalar - Valdori CRM'
})
</script>