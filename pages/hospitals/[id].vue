<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <NuxtLink to="/hospitals" class="text-gray-400 hover:text-gray-500">
                Hastaneler
              </NuxtLink>
            </li>
            <li class="flex items-center">
              <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400" />
              <span class="ml-4 text-sm font-medium text-gray-500">{{ hospital?.name }}</span>
            </li>
          </ol>
        </nav>
        <h1 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{{ hospital?.name }}</h1>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="editHospital"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PencilIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Düzenle
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Hospital Details -->
    <div v-else-if="hospital" class="space-y-6">
      <!-- Basic Info Card -->
      <div class="card">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Hastane Bilgileri</h3>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700">
          <dl>
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Hastane Adı</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">{{ hospital.name }}</dd>
            </div>
            <div class="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Hastane Kodu</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">{{ hospital.code }}</dd>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Adres</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">{{ hospital.address || '-' }}</dd>
            </div>
            <div class="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Açıklama</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">{{ hospital.description || '-' }}</dd>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Kayıt Tarihi</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">{{ formatDate(hospital.createdAt) }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Branches -->
      <div class="card">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Branşlar</h3>
          <button
            @click="showAddBranchModal = true"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <PlusIcon class="-ml-0.5 mr-1.5 h-4 w-4" />
            Branş Ekle
          </button>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700">
          <div v-if="branches.length === 0" class="text-center py-12">
            <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Branş bulunamadı</h3>
            <p class="mt-1 text-sm text-gray-500">Bu hastaneye henüz branş eklenmemiş.</p>
          </div>
          <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="branch in branches" :key="branch.id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ branch.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Kod: {{ branch.code }}</p>
                </div>
                <NuxtLink
                  :to="`/branches/${branch.id}`"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                >
                  Detay
                </NuxtLink>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Doctors -->
      <div class="card">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Doktorlar</h3>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700">
          <div v-if="hospitalDoctors.length === 0" class="text-center py-12">
            <UserGroupIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Doktor bulunamadı</h3>
            <p class="mt-1 text-sm text-gray-500">Bu hastanede çalışan doktor bulunmuyor.</p>
          </div>
          <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="assignment in hospitalDoctors" :key="assignment.id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ assignment.doctor?.title }} {{ assignment.doctor?.name }} {{ assignment.doctor?.surname }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ assignment.doctor?.specialization || 'Uzmanlık belirtilmemiş' }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">
                    Başlangıç: {{ formatDate(assignment.startDate) }}
                    {{ assignment.endDate ? ` - Bitiş: ${formatDate(assignment.endDate)}` : '' }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="assignment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ assignment.isActive ? 'Aktif' : 'Pasif' }}
                  </span>
                  <NuxtLink
                    :to="`/doctors/${assignment.doctorId}`"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                  >
                    Detay
                  </NuxtLink>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <HospitalFormModal
      :show="showEditModal"
      :hospital="hospital"
      @close="showEditModal = false"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import {
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
  BuildingOfficeIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const hospitalId = computed(() => parseInt(route.params.id))

const { fetchHospital } = useHospitals()
const { branches, fetchBranches } = useBranches()
const { assignments: hospitalDoctors, fetchAssignments } = useDoctorHospitals()

const hospital = ref(null)
const loading = ref(true)
const showEditModal = ref(false)
const showAddBranchModal = ref(false)

const editHospital = () => {
  showEditModal.value = true
}

const handleSaved = async () => {
  await loadData()
  showEditModal.value = false
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const loadData = async () => {
  loading.value = true
  try {
    // Load hospital details
    hospital.value = await fetchHospital(hospitalId.value)
    
    // Load related branches
    await fetchBranches(hospitalId.value)
    
    // Load related doctors
    await fetchAssignments(null, hospitalId.value)
  } catch (error) {
    console.error('Error loading hospital details:', error)
    useToast().error('Hastane bilgileri yüklenirken bir hata oluştu')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Page head
useHead({
  title: computed(() => `${hospital.value?.name || 'Hastane'} - Valdori CRM`)
})
</script>