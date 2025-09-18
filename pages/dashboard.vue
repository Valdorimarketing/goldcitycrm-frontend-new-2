<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Valdori CRM yönetim paneline hoş geldiniz</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.name" class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component
              :is="stat.icon"
              class="h-8 w-8 text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ stat.name }}
              </dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stat.value }}
              </dd>
            </dl>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component
                :is="stat.changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon"
                :class="[
                  stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500',
                  'h-4 w-4'
                ]"
              />
            </div>
            <div class="ml-2">
              <span
                :class="[
                  stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500',
                  'text-sm font-medium'
                ]"
              >
                {{ stat.change }}
              </span>
              <span class="text-sm text-gray-500 ml-1">
                son 30 gün
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Recent Customers -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Son Müşteriler</h3>
          <NuxtLink
            to="/customers"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            Tümünü gör
          </NuxtLink>
        </div>
        
        <!-- Loading State -->
        <div v-if="loadingCustomers" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
        
        <!-- Data -->
        <div v-else-if="recentCustomers.length > 0" class="space-y-3">
          <div
            v-for="customer in recentCustomers"
            :key="customer.id"
            class="flex items-center space-x-3"
          >
            <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span class="text-sm font-medium text-gray-600">
                {{ customer.name?.charAt(0) || '?' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ customer.name || 'İsimsiz' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ customer.email || '-' }}
              </p>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(customer.createdAt) }}
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Henüz müşteri bulunmuyor</p>
        </div>
        
        <div class="mt-4">
          <NuxtLink
            to="/customers/new"
            class="btn-primary text-center block"
          >
            Yeni Müşteri Ekle
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Sales -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Son Satışlar</h3>
          <NuxtLink
            to="/sales"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            Tümünü gör
          </NuxtLink>
        </div>
        
        <!-- Loading State -->
        <div v-if="loadingSales" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center justify-between">
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-3/4"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
            </div>
            <div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-20"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
            </div>
          </div>
        </div>
        
        <!-- Data -->
        <div v-else-if="recentSales.length > 0" class="space-y-3">
          <div
            v-for="sale in recentSales"
            :key="sale.id"
            class="flex items-center justify-between"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ sale.customer?.name || 'Bilinmeyen Müşteri' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ sale.description || 'Açıklama yok' }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-green-600">
                ₺{{ formatCurrency(sale.amount || 0) }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(sale.date) }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Henüz satış bulunmuyor</p>
        </div>
        
        <div class="mt-4">
          <NuxtLink
            to="/sales/new"
            class="btn-primary text-center block"
          >
            Yeni Satış Ekle
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Upcoming Meetings -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Yaklaşan Toplantılar</h3>
        <NuxtLink
          to="/meetings"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors"
        >
          Tümünü gör
        </NuxtLink>
      </div>
      <div class="overflow-hidden">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="table-header">Başlık</th>
              <th class="table-header">Müşteri</th>
              <th class="table-header">Tarih</th>
              <th class="table-header">Saat</th>
              <th class="table-header">Durum</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="meeting in upcomingMeetings" :key="meeting.id">
              <td class="table-cell font-medium">{{ meeting.title }}</td>
              <td class="table-cell">{{ meeting.customer?.name || '-' }}</td>
              <td class="table-cell">{{ formatDate(meeting.date) }}</td>
              <td class="table-cell">{{ meeting.time }}</td>
              <td class="table-cell">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(meeting.status)"
                >
                  {{ meeting.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4">
        <NuxtLink
          to="/meetings/new"
          class="btn-primary text-center block"
        >
          Yeni Toplantı Planla
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  // middleware: 'auth' // Temporarily disabled
})

// Stores
const customersStore = useCustomersStore()
const salesStore = useSalesStore()

// Loading states
const loadingStats = ref(true)
const loadingCustomers = ref(true)
const loadingSales = ref(true)

// Data
const totalCustomers = ref(0)
const totalSales = ref(0)
const totalRevenue = ref(0)
const recentCustomers = ref([])
const recentSales = ref([])

// Calculate statistics
const calculateStats = async () => {
  try {
    loadingStats.value = true
    
    // Fetch customers to get total count
    await customersStore.fetchCustomers(1, 1000)
    totalCustomers.value = customersStore.pagination?.total || 0
    
    // Fetch sales to calculate revenue
    await salesStore.fetchSales(1, 1000)
    const allSales = salesStore.sales || []
    
    // Calculate current month sales
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const currentMonthSales = allSales.filter(sale => {
      const saleDate = new Date(sale.date)
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear
    })
    
    totalSales.value = currentMonthSales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
    totalRevenue.value = allSales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
    
  } catch (error) {
    console.error('Error calculating stats:', error)
  } finally {
    loadingStats.value = false
  }
}

// Fetch recent customers
const fetchRecentCustomers = async () => {
  try {
    loadingCustomers.value = true
    await customersStore.fetchCustomers(1, 3)
    recentCustomers.value = (customersStore.customers || []).slice(0, 3)
  } catch (error) {
    console.error('Error fetching recent customers:', error)
    recentCustomers.value = []
  } finally {
    loadingCustomers.value = false
  }
}

// Fetch recent sales
const fetchRecentSales = async () => {
  try {
    loadingSales.value = true
    await salesStore.fetchSales(1, 3)
    recentSales.value = (salesStore.sales || []).slice(0, 3)
  } catch (error) {
    console.error('Error fetching recent sales:', error)
    recentSales.value = []
  } finally {
    loadingSales.value = false
  }
}

// Initialize data on mount
onMounted(async () => {
  await Promise.all([
    calculateStats(),
    fetchRecentCustomers(),
    fetchRecentSales()
  ])
})

// Computed stats with real data
const stats = computed(() => [
  {
    name: 'Toplam Müşteri',
    value: loadingStats.value ? '...' : totalCustomers.value.toLocaleString('tr-TR'),
    change: '+12%',
    changeType: 'increase',
    icon: UsersIcon
  },
  {
    name: 'Bu Ay Satış',
    value: loadingStats.value ? '...' : `₺${totalSales.value.toLocaleString('tr-TR')}`,
    change: '+8%',
    changeType: 'increase',
    icon: ShoppingBagIcon
  },
  {
    name: 'Toplam Gelir',
    value: loadingStats.value ? '...' : `₺${totalRevenue.value.toLocaleString('tr-TR')}`,
    change: '+15%',
    changeType: 'increase',
    icon: CurrencyDollarIcon
  },
  {
    name: 'Bekleyen Toplantı',
    value: '0',
    change: '0%',
    changeType: 'increase',
    icon: CalendarIcon
  }
])

// Meetings are still mock data as we don't have a meetings store yet
const upcomingMeetings = ref([
  {
    id: 1,
    title: 'Proje Görüşmesi',
    date: '2024-01-20',
    time: '14:00',
    status: 'Planlandı',
    customer: { name: 'Ali Veli' }
  },
  {
    id: 2,
    title: 'Demo Sunumu',
    date: '2024-01-21',
    time: '10:30',
    status: 'Onaylandı',
    customer: { name: 'Ayşe Yılmaz' }
  }
])

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Planlandı':
      return 'bg-yellow-100 text-yellow-800'
    case 'Onaylandı':
      return 'bg-green-100 text-green-800'
    case 'İptal':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Page head
useHead({
  title: 'Dashboard - Valdori CRM'
})
</script> 