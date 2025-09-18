<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ödemeler</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Tüm ödeme işlemlerinizi buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/payments/new"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Ödeme
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CreditCardIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Toplam Gelir
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ₺{{ formatCurrency(totalPayments) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Tamamlanan
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ₺{{ formatCurrency(completedPayments) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ClockIcon class="h-8 w-8 text-yellow-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Bekleyen
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ₺{{ formatCurrency(pendingPayments) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <XCircleIcon class="h-8 w-8 text-red-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Başarısız
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ₺{{ formatCurrency(failedPayments) }}
              </dd>
            </dl>
          </div>
        </div>
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
            placeholder="Müşteri adı..."
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
            <option value="completed">Tamamlandı</option>
            <option value="pending">Bekliyor</option>
            <option value="failed">Başarısız</option>
            <option value="refunded">İade</option>
          </select>
        </div>
        <div>
          <label for="method" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ödeme Yöntemi
          </label>
          <select
            id="method"
            v-model="methodFilter"
            class="form-input"
          >
            <option value="">Tüm Yöntemler</option>
            <option value="credit_card">Kredi Kartı</option>
            <option value="bank_transfer">Banka Havalesi</option>
            <option value="cash">Nakit</option>
            <option value="check">Çek</option>
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

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Payments Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header">Müşteri</th>
              <th class="table-header">Miktar</th>
              <th class="table-header">Yöntem</th>
              <th class="table-header">Tarih</th>
              <th class="table-header">Durum</th>
              <th class="table-header">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="payment in filteredPayments" :key="payment.id">
              <td class="table-cell">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {{ payment.customer?.name?.charAt(0)?.toUpperCase() || '?' }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ payment.customer?.name || 'Bilinmeyen Müşteri' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ payment.customer?.company || '-' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  ₺{{ formatCurrency(payment.amount) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="flex items-center space-x-2">
                  <component
                    :is="getPaymentMethodIcon(payment.method)"
                    class="h-5 w-5 text-gray-400 dark:text-gray-500"
                  />
                  <span class="text-sm text-gray-900 dark:text-gray-100">
                    {{ getPaymentMethodText(payment.method) }}
                  </span>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(payment.date) }}
                </div>
              </td>
              <td class="table-cell">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(payment.status)"
                >
                  {{ getStatusText(payment.status) }}
                </span>
              </td>
              <td class="table-cell">
                <div class="flex space-x-2">
                  <NuxtLink
                    :to="`/payments/${payment.id}`"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                  >
                    Görüntüle
                  </NuxtLink>
                  <button
                    v-if="payment.status === 'completed'"
                    @click="refundPayment(payment)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm"
                  >
                    İade
                  </button>
                  <button
                    @click="confirmDelete(payment)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="filteredPayments.length === 0">
              <td colspan="6" class="text-center py-12">
                <CreditCardIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Ödeme bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ searchTerm ? 'Arama kriterlerinize uygun ödeme bulunamadı.' : 'Henüz ödeme kaydı eklenmemiş.' }}
                </p>
                <div class="mt-6">
                  <NuxtLink
                    to="/payments/new"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                    İlk ödemeyi ekle
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
                  Ödemeyi Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Bu ödeme kaydını silmek istediğinizden emin misiniz? 
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
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BanknotesIcon,
  DocumentIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// definePageMeta({
//   middleware: 'auth'
// })

// Search and filters
const searchTerm = ref('')
const statusFilter = ref('')
const methodFilter = ref('')
const loading = ref(false)

// Delete modal
const showDeleteModal = ref(false)
const paymentToDelete = ref(null)

// Sample payments data
const samplePayments = ref([
  {
    id: 1,
    amount: 15000,
    date: '2024-01-15',
    status: 'completed',
    method: 'credit_card',
    customer: { name: 'Ahmet Yılmaz', company: 'ABC Şirketi' },
    sale: { id: 1, description: 'Web sitesi geliştirme' }
  },
  {
    id: 2,
    amount: 8500,
    date: '2024-01-10',
    status: 'pending',
    method: 'bank_transfer',
    customer: { name: 'Fatma Kaya', company: 'XYZ Ltd.' },
    sale: { id: 2, description: 'Mobil uygulama' }
  },
  {
    id: 3,
    amount: 25000,
    date: '2024-01-05',
    status: 'completed',
    method: 'bank_transfer',
    customer: { name: 'Mehmet Demir', company: 'DEF Corp.' },
    sale: { id: 3, description: 'E-ticaret platformu' }
  },
  {
    id: 4,
    amount: 3500,
    date: '2024-01-20',
    status: 'failed',
    method: 'credit_card',
    customer: { name: 'Ayşe Öztürk', company: 'GHI İnc.' },
    sale: { id: 4, description: 'Logo tasarım' }
  },
  {
    id: 5,
    amount: 12000,
    date: '2024-01-18',
    status: 'refunded',
    method: 'cash',
    customer: { name: 'Ali Veli', company: 'JKL Group' },
    sale: { id: 5, description: 'Danışmanlık hizmeti' }
  }
])

// Computed properties
const filteredPayments = computed(() => {
  let filtered = samplePayments.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(payment =>
      payment.customer?.name?.toLowerCase().includes(search) ||
      payment.customer?.company?.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(payment => payment.status === statusFilter.value)
  }

  if (methodFilter.value) {
    filtered = filtered.filter(payment => payment.method === methodFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalPayments = computed(() => {
  return samplePayments.value.reduce((sum, payment) => sum + payment.amount, 0)
})

const completedPayments = computed(() => {
  return samplePayments.value
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0)
})

const pendingPayments = computed(() => {
  return samplePayments.value
    .filter(payment => payment.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0)
})

const failedPayments = computed(() => {
  return samplePayments.value
    .filter(payment => payment.status === 'failed')
    .reduce((sum, payment) => sum + payment.amount, 0)
})

// Methods
const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  methodFilter.value = ''
}

const confirmDelete = (payment) => {
  paymentToDelete.value = payment
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (paymentToDelete.value) {
    try {
      // For demo, just remove from sample data
      samplePayments.value = samplePayments.value.filter(
        p => p.id !== paymentToDelete.value.id
      )
    } catch (error) {
      console.error('Error deleting payment:', error)
    }
  }
  showDeleteModal.value = false
  paymentToDelete.value = null
}

const refundPayment = async (payment) => {
  try {
    // For demo, just update status
    const index = samplePayments.value.findIndex(p => p.id === payment.id)
    if (index !== -1) {
      samplePayments.value[index].status = 'refunded'
    }
  } catch (error) {
    console.error('Error refunding payment:', error)
  }
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
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'refunded':
      return 'bg-gray-100 text-gray-800'
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
    case 'failed':
      return 'Başarısız'
    case 'refunded':
      return 'İade'
    default:
      return 'Bilinmiyor'
  }
}

const getPaymentMethodIcon = (method) => {
  switch (method) {
    case 'credit_card':
      return CreditCardIcon
    case 'bank_transfer':
      return BanknotesIcon
    case 'cash':
      return BanknotesIcon
    case 'check':
      return DocumentIcon
    default:
      return CreditCardIcon
  }
}

const getPaymentMethodText = (method) => {
  switch (method) {
    case 'credit_card':
      return 'Kredi Kartı'
    case 'bank_transfer':
      return 'Banka Havalesi'
    case 'cash':
      return 'Nakit'
    case 'check':
      return 'Çek'
    default:
      return 'Bilinmiyor'
  }
}

// Page head
useHead({
  title: 'Ödemeler - Valdori CRM'
})
</script> 