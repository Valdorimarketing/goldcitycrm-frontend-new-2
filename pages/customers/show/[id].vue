<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="min-w-0 flex-1">
          <nav class="flex mb-4" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <NuxtLink to="/customers" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Müşteriler
                </NuxtLink>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-500 dark:text-gray-400 ml-1 md:ml-2">{{ customer?.name || 'Müşteri' }}</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl">
            {{ customer ? `${customer.name} ${customer.surname}` : 'Müşteri Detayı' }}
          </h1>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <NuxtLink
            :to="`/customers/edit/${$route.params.id}`"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Düzenle
          </NuxtLink>
          <button
            @click="goBack"
            class="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Geri
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <div class="text-sm text-red-700 dark:text-red-300">{{ error }}</div>
      </div>

      <!-- Customer Details -->
      <div v-else-if="customer" class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Müşteri Bilgileri
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Müşteri detay bilgileri ve iletişim verileri.
          </p>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700">
          <dl>
            <!-- Name -->
            <div class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ad Soyad
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ customer.name }} {{ customer.surname }}
              </dd>
            </div>

            <!-- Title -->
            <div v-if="customer.title" class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ünvan
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ customer.title }}
              </dd>
            </div>

            <!-- Email -->
            <div class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                E-posta
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                <a :href="`mailto:${customer.email}`" class="text-indigo-600 hover:text-indigo-500">
                  {{ customer.email }}
                </a>
              </dd>
            </div>

            <!-- Gender -->
            <div v-if="customer.gender" class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Cinsiyet
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ getGenderText(customer.gender) }}
              </dd>
            </div>

            <!-- Birth Date -->
            <div v-if="customer.birth_date" class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Doğum Tarihi
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ formatBirthDate(customer.birth_date) }}
              </dd>
            </div>

            <!-- Phone -->
            <div v-if="customer.phone" class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Telefon
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                <a :href="`tel:${customer.phone}`" class="text-indigo-600 hover:text-indigo-500">
                  {{ customer.phone }}
                </a>
              </dd>
            </div>

            <!-- Source -->
            <div v-if="customer.source?.name" class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Kaynak
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ customer.source.name }}
              </dd>
            </div>

            <!-- Job -->
            <div v-if="customer.job" class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Meslek
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ customer.job }}
              </dd>
            </div>

            <!-- Identity Number -->
            <div v-if="customer.identity_number" class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Kimlik Numarası
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ customer.identity_number }}
              </dd>
            </div>

            <!-- Reference Customer -->
            <div v-if="customer.referance?.name" class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Referans Müşteri
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                <NuxtLink :to="`/customers/show/${customer.referance.id}`" class="text-indigo-600 hover:text-indigo-500">
                  {{ customer.referance.name }} {{ customer.referance.surname }}
                </NuxtLink>
              </dd>
            </div>

            <!-- Language -->
            <div v-if="customer.language" class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Dil
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ customer.language }}
              </dd>
            </div>

            <!-- Website -->
            <div v-if="customer.website" class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Website
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                <a :href="customer.website" target="_blank" class="text-indigo-600 hover:text-indigo-500">
                  {{ customer.website }}
                </a>
              </dd>
            </div>

            <!-- Address -->
            <div v-if="customer.address" class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Adres
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ customer.address }}
              </dd>
            </div>

            <!-- Location -->
            <div v-if="locationText" class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Konum
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ locationText }}
              </dd>
            </div>

            <!-- Postal Code -->
            <div v-if="customer.postal_code" class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Posta Kodu
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ customer.postal_code }}
              </dd>
            </div>

            <!-- Relevant User -->
            <div v-if="customer.user?.name" class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Sorumlu Kullanıcı
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ customer.user.name }}
              </dd>
            </div>

            <!-- Description -->
            <div v-if="customer.description" class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Açıklama
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ customer.description }}
              </dd>
            </div>

            <!-- Status -->
            <div class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Durum
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                <div class="flex items-center space-x-3">
                  <span :class="[
                    customer.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
                  ]">
                    {{ customer.isActive ? 'Aktif' : 'Pasif' }}
                  </span>
                  <span v-if="customerStatus" :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    customerStatus.color 
                      ? `bg-[${customerStatus.color}20] text-[${customerStatus.color}]`
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  ]">
                    {{ customerStatus.name }}
                  </span>
                </div>
              </dd>
            </div>

            <!-- Created Date -->
            <div v-if="customer.createdAt" class="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Oluşturulma Tarihi
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                {{ formatDate(customer.createdAt) }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Dynamic Fields Section -->
      <div v-if="customerDynamicFields.length > 0" class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Dinamik Alanlar
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Müşteriye özel dinamik alanlar ve değerleri.
          </p>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700">
          <dl>
            <div 
              v-for="field in sortedDynamicFields" 
              :key="field.id"
              :class="[
                field.order % 2 === 0 
                  ? 'bg-gray-50 dark:bg-gray-900' 
                  : 'bg-white dark:bg-gray-800',
                'px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
              ]"
            >
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ field.name }}
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
                <!-- Text/Number/Email/Phone/URL -->
                <span v-if="['text', 'number', 'email', 'phone', 'url'].includes(field.type)">
                  <a v-if="field.type === 'email'" :href="`mailto:${field.value}`" class="text-indigo-600 hover:text-indigo-500">
                    {{ field.value }}
                  </a>
                  <a v-else-if="field.type === 'phone'" :href="`tel:${field.value}`" class="text-indigo-600 hover:text-indigo-500">
                    {{ field.value }}
                  </a>
                  <a v-else-if="field.type === 'url'" :href="field.value" target="_blank" class="text-indigo-600 hover:text-indigo-500">
                    {{ field.value }}
                  </a>
                  <span v-else>{{ field.value }}</span>
                </span>
                
                <!-- Date -->
                <span v-else-if="field.type === 'date'">
                  {{ formatDate(field.value) }}
                </span>
                
                <!-- Textarea -->
                <span v-else-if="field.type === 'textarea'" class="whitespace-pre-wrap">
                  {{ field.value }}
                </span>
                
                <!-- File -->
                <span v-else-if="field.type === 'file'">
                  <a v-if="field.file" :href="field.file" target="_blank" class="text-indigo-600 hover:text-indigo-500">
                    {{ field.file.split('/').pop() }}
                  </a>
                  <span v-else>{{ field.value }}</span>
                </span>
                
                <!-- Select -->
                <span v-else-if="field.type === 'select'">
                  {{ field.value }}
                </span>
                
                <!-- Default -->
                <span v-else>{{ field.value }}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// definePageMeta({
//   middleware: 'auth'
// })

const route = useRoute()
const router = useRouter()

// Reactive state
const customer = ref(null)
const loading = ref(true)
const error = ref('')
const customerDynamicFields = ref([])
const loadingDynamicFields = ref(false)
const statuses = ref([])
const locations = ref({
  countries: [],
  states: [],
  cities: [],
  districts: []
})

// Computed properties
const locationText = computed(() => {
  if (!customer.value) return ''
  
  const parts = []
  
  // Find location names from IDs
  const country = locations.value.countries.find(c => c.id === customer.value.country)
  const state = locations.value.states.find(s => s.id === customer.value.state)
  const city = locations.value.cities.find(c => c.id === customer.value.city)
  const district = locations.value.districts.find(d => d.id === customer.value.district)
  
  if (district) parts.push(district.name)
  if (city) parts.push(city.name)
  if (state) parts.push(state.name)
  if (country) parts.push(country.name)
  
  return parts.join(', ')
})

const sortedDynamicFields = computed(() => {
  return customerDynamicFields.value.sort((a, b) => a.order - b.order)
})

const customerStatus = computed(() => {
  if (!customer.value || !customer.value.status) return null
  const status = statuses.value.find(s => s.id === customer.value.status)
  return status || null
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatBirthDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getGenderText = (gender) => {
  const genders = {
    'male': 'Erkek',
    'female': 'Kadın',
    'other': 'Diğer'
  }
  return genders[gender] || gender
}

const goBack = () => {
  router.push('/customers')
}

const fetchLocations = async () => {
  try {
    const api = useApi()
    const [countriesRes, statesRes, citiesRes, districtsRes, statusesRes] = await Promise.all([
      api('/countries'),
      api('/states'),
      api('/cities'),
      api('/districts').catch(() => []),
      api('/statuses').catch(() => [])
    ])
    
    locations.value = {
      countries: countriesRes,
      states: statesRes,
      cities: citiesRes,
      districts: districtsRes
    }
    
    statuses.value = statusesRes.data || statusesRes || []
  } catch (err) {
    console.error('Error fetching locations:', err)
  }
}

const fetchCustomer = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const api = useApi()
    const response = await api(`/customers/${route.params.id}`)
    
    console.log('Customer data received:', response)
    customer.value = response
  } catch (err) {
    console.error('Error fetching customer:', err)
    if (err?.data?.statusCode === 404 || err?.status === 404) {
      error.value = 'Müşteri bulunamadı.'
    } else if (err?.data?.statusCode === 401 || err?.status === 401) {
      error.value = 'Oturum açmanız gerekiyor. Lütfen giriş yapın.'
    } else {
      error.value = `Müşteri bilgileri yüklenirken bir hata oluştu: ${err?.data?.message || err?.message || 'Bilinmeyen hata'}`
    }
  } finally {
    loading.value = false
  }
}

const fetchCustomerDynamicFields = async () => {
  try {
    loadingDynamicFields.value = true
    // Dynamic fields come with customer data
    if (customer.value?.dynamicFieldValues) {
      customerDynamicFields.value = customer.value.dynamicFieldValues.map(field => ({
        id: field.id,
        name: field.name,
        type: field.type,
        value: field.options_data || field.file,
        file: field.file,
        order: field.order
      }))
    }
  } catch (err) {
    console.error('Error fetching customer dynamic fields:', err)
    // Don't show error for dynamic fields, just log it
  } finally {
    loadingDynamicFields.value = false
  }
}

// Load data on mount
onMounted(async () => {
  await fetchLocations()
  await fetchCustomer()
  await fetchCustomerDynamicFields()
})

// Page title
useHead({
  title: computed(() => 
    customer.value 
      ? `${customer.value.name} ${customer.value.surname} - Müşteri Detayı`
      : 'Müşteri Detayı'
  )
})
</script> 