<template>
  <div class="overflow-x-auto">
    

    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            @click="sortBy(col.key)" 
            class="table-header cursor-pointer text-gray-700 dark:text-gray-300"
          >
            <div class="flex items-center gap-1">
              {{ col.label }}
              <span v-if="sortColumn === col.key">
                <svg v-if="sortDirection === 'asc'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 12l5-5 5 5H5z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 8l5 5 5-5H5z"/>
                </svg>
              </span>
            </div>
          </th>
          <th class="table-header text-gray-700 dark:text-gray-300">İşlemler</th>
        </tr>
      </thead>

      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-sm font-light">
        <tr v-for="customer in filteredAndSorted" :key="customer.id">
          <td class="table-cell">{{ customer.name }}</td>
          <td class="table-cell">{{ customer.phone || '-' }}</td>
          <td class="table-cell">{{ getStatusText(customer.status) }}</td>
          <td class="table-cell">{{ customer.source || '-' }}</td>
          <td class="table-cell">{{ customer.relatedTransaction || '-' }}</td>
          <td class="table-cell">{{ customer.user?.name || '-' }}</td>
          <td class="table-cell">{{ customer.relevantUser ? `${customer.relevantUser.name}` : '-' }}</td>
          <td class="table-cell">{{ customer.isActive ? 'Aktif' : 'Pasif' }}</td>
          <td class="table-cell">{{ formatDate(customer.createdAt) }}</td>
          <td class="table-cell">
            <!-- Actions -->
            <div class="flex gap-1">
              <NuxtLink
                :to="`/customers/show/${customer.id}`"
                class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Görüntüle"
              >
                <EyeIcon class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span class="tooltip">Görüntüle</span>
              </NuxtLink>

              <button
                @click="$emit('show-history', customer)"
                class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Geçmiş"
              >
                <ClockIcon class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span class="tooltip">Geçmiş</span>
              </button>

              <button
                @click="$emit('show-notes', customer)"
                class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Notlar"
              >
                <DocumentTextIcon class="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span class="tooltip">Notlar</span>
              </button>

              <button
                @click="$emit('show-doctor-assignment', customer)"
                class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Doktor Görüşüne Gönder"
              >
                <UserIcon class="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span class="tooltip z-10">Doktor Görüşüne Gönder</span>
              </button>

              <button
                @click="$emit('show-services', customer)"
                class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Hizmetler"
              >
                <ShoppingBagIcon class="h-4 w-4 text-green-600 dark:text-green-400" />
                <span class="tooltip">Hizmetler</span>
              </button>

              <button
                @click="$emit('show-files', customer)"
                class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Müşteri Dosyaları"
              >
                <FolderIcon class="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <span class="tooltip">Müşteri Dosyaları</span>
              </button>

              <NuxtLink
                v-if="isEditable"
                :to="`/customers/edit/${customer.id}`"
                class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Düzenle"
              >
                <PencilIcon class="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span class="tooltip">Düzenle</span>
              </NuxtLink>

              <button
                v-if="isDeleteable"
                @click="$emit('confirm-delete', customer)"
                class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Sil"
              >
                <TrashIcon class="h-4 w-4 text-red-600 dark:text-red-400" />
                <span class="tooltip">Sil</span>
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="filteredAndSorted.length === 0">
          <td colspan="10" class="text-center py-12">
            <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Müşteri bulunamadı</h3>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ClockIcon, DocumentTextIcon, EyeIcon, FolderIcon, PencilIcon, ShoppingBagIcon, TrashIcon, UserIcon } from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  isEditable: { type: Boolean, default: false },
  isDeleteable: { type: Boolean, default: false }
})

const emit = defineEmits([
  'confirm-delete',
  'show-history',
  'show-notes',
  'show-doctor-assignment',
  'show-services',
  'show-files'
])

const statusMap = ref({
  1: 'Yeni',
  2: 'İlgileniliyor',
  3: 'Tamamlandı',
  4: 'Reddedildi'
})

 

// Sıralama
const sortColumn = ref('')
const sortDirection = ref('asc')
const columns = [
  { label: 'İsim', key: 'name' },
  { label: 'Telefon', key: 'phone' },
  { label: 'Durum', key: 'status' },
  { label: 'Kaynak', key: 'source' },
  { label: 'İlgilenilen Konu', key: 'relatedTransaction' },
  { label: 'Oluşturan', key: 'user.name' },
  { label: 'Atanan', key: 'relevantUser.name' },
  { label: 'Aktif', key: 'isActive' },
  { label: 'Eklenme Tarihi', key: 'createdAt' }
]

const sortBy = (key) => {
  if (sortColumn.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = key
    sortDirection.value = 'asc'
  }
}

const customers = computed(() => props.data)

const filteredAndSorted = computed(() => {
  let result = customers.value
  
  if (sortColumn.value) {
    result = result.slice().sort((a, b) => {
      const aVal = getValueByPath(a, sortColumn.value)
      const bVal = getValueByPath(b, sortColumn.value)
      if (aVal === bVal) return 0
      if (!aVal) return 1
      if (!bVal) return -1
      return sortDirection.value === 'asc'
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString())
    })
  }

  return result
})

function getValueByPath(obj, path) {
  return path.split('.').reduce((o, key) => (o ? o[key] : null), obj)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getStatusText(status) {
  return statusMap.value[status] || '-'
}
</script>

<style scoped>
.tooltip {
  @apply absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none;
}
</style>
