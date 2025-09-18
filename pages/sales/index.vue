<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Satışlar</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Tüm satış işlemlerinizi buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/sales/new"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Satış
        </NuxtLink>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            class="form-input"
            placeholder="Müşteri adı veya açıklama..."
          />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Durum
          </label>
          <select
            id="status"
            v-model="statusFilter"
            class="form-input"
          >
            <option value="">Tüm Durumlar</option>
            <option value="pending">Bekliyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>
        <div>
          <label for="dateRange" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tarih Aralığı
          </label>
          <select
            id="dateRange"
            v-model="dateFilter"
            class="form-input"
          >
            <option value="">Tüm Tarihler</option>
            <option value="today">Bugün</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="btn-secondary"
          >
            Filtreleri Temizle
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CurrencyDollarIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Toplam Satış
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ₺{{ formatCurrency(totalSales) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ShoppingBagIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Bu Ay
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ₺{{ formatCurrency(monthSales) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ArrowTrendingUpIcon class="h-8 w-8 text-indigo-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Ortalama Satış
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ₺{{ formatCurrency(averageSale) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Sales Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header">Müşteri</th>
              <th class="table-header">Açıklama</th>
              <th class="table-header">Miktar</th>
              <th class="table-header">Tarih</th>
              <th class="table-header">Durum</th>
              <th class="table-header">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="sale in filteredSales" :key="sale.id">
              <td class="table-cell">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {{ sale.customer?.name?.charAt(0)?.toUpperCase() || '?' }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ sale.customer?.name || 'Bilinmeyen Müşteri' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ sale.customer?.company || '-' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ sale.description || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm font-medium text-green-600">
                  ₺{{ formatCurrency(sale.amount) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(sale.date) }}
                </div>
              </td>
              <td class="table-cell">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(sale.status)"
                >
                  {{ getStatusText(sale.status) }}
                </span>
              </td>
              <td class="table-cell">
                <div class="flex space-x-2">
                  <NuxtLink
                    :to="`/sales/${sale.id}`"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                  >
                    Görüntüle
                  </NuxtLink>
                  <NuxtLink
                    :to="`/sales/${sale.id}/edit`"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm"
                  >
                    Düzenle
                  </NuxtLink>
                  <button
                    @click="confirmDelete(sale)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="filteredSales.length === 0">
              <td colspan="6" class="text-center py-12">
                <ShoppingBagIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Satış bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ searchTerm ? 'Arama kriterlerinize uygun satış bulunamadı.' : 'Henüz satış kaydı eklenmemiş.' }}
                </p>
                <div class="mt-6">
                  <NuxtLink
                    to="/sales/new"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                    İlk satışı ekle
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900">
                  Satışı Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Bu satış kaydını silmek istediğinizden emin misiniz? 
                    Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              @click="handleDelete"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              Sil
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// definePageMeta({
//   middleware: 'auth'
// })

// Search and filters
const searchTerm = ref('')
const statusFilter = ref('')
const dateFilter = ref('')

// Delete modal
const showDeleteModal = ref(false)
const saleToDelete = ref(null)
const loading = ref(false)

// Sample sales data
const sampleSales = ref([
  {
    id: 1,
    customerId: 1,
    amount: 15000,
    date: '2024-01-15',
    status: 'completed',
    description: 'Web sitesi geliştirme projesi',
    customer: { name: 'Ahmet Yılmaz', company: 'ABC Şirketi' }
  },
  {
    id: 2,
    customerId: 2,
    amount: 8500,
    date: '2024-01-10',
    status: 'pending',
    description: 'Mobil uygulama geliştirme',
    customer: { name: 'Fatma Kaya', company: 'XYZ Ltd.' }
  },
  {
    id: 3,
    customerId: 3,
    amount: 25000,
    date: '2024-01-05',
    status: 'completed',
    description: 'E-ticaret platformu',
    customer: { name: 'Mehmet Demir', company: 'DEF Corp.' }
  },
  {
    id: 4,
    customerId: 4,
    amount: 3500,
    date: '2024-01-20',
    status: 'cancelled',
    description: 'Logo tasarım projesi',
    customer: { name: 'Ayşe Öztürk', company: 'GHI İnc.' }
  }
])

// Computed properties
const filteredSales = computed(() => {
  let filtered = sampleSales.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(sale =>
      sale.customer?.name?.toLowerCase().includes(search) ||
      sale.description?.toLowerCase().includes(search) ||
      sale.customer?.company?.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(sale => sale.status === statusFilter.value)
  }

  if (dateFilter.value) {
    const now = new Date()
    filtered = filtered.filter(sale => {
      const saleDate = new Date(sale.date)
      switch (dateFilter.value) {
        case 'today':
          return saleDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return saleDate >= weekAgo
        case 'month':
          return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
        case 'year':
          return saleDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  return filtered
})

const totalSales = computed(() => {
  return sampleSales.value.reduce((sum, sale) => sum + sale.amount, 0)
})

const monthSales = computed(() => {
  const now = new Date()
  return sampleSales.value
    .filter(sale => {
      const saleDate = new Date(sale.date)
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, sale) => sum + sale.amount, 0)
})

const averageSale = computed(() => {
  return sampleSales.value.length > 0 ? totalSales.value / sampleSales.value.length : 0
})

// Methods
const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  dateFilter.value = ''
}

const confirmDelete = (sale) => {
  saleToDelete.value = sale
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (saleToDelete.value) {
    try {
      // For demo, just remove from sample data
      sampleSales.value = sampleSales.value.filter(
        s => s.id !== saleToDelete.value.id
      )
    } catch (error) {
      console.error('Error deleting sale:', error)
    }
  }
  showDeleteModal.value = false
  saleToDelete.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Tamamlandı'
    case 'pending':
      return 'Bekliyor'
    case 'cancelled':
      return 'İptal'
    default:
      return 'Bilinmiyor'
  }
}

// Page head
useHead({
  title: 'Satışlar - Valdori CRM'
})
</script> 