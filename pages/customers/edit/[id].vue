<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-6xl mx-auto py-6 px-4">
      
      <!-- Başlık -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Müşteri Düzenle</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Müşteri bilgilerini güncelleyin</p>
      </div>

      <!-- Yükleniyor mesajı -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Müşteri bilgileri yükleniyor...</span>
      </div>

      <!-- Hata mesajı -->
      <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- Form -->
      <div v-if="!loading && !error" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form @submit.prevent="saveCustomer" class="space-y-8">
          
          <!-- Temel Bilgiler -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Temel Bilgiler</h3>
            
            <!-- Ad Soyad -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ad *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteri adı"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Soyad *
                </label>
                <input
                  v-model="form.surname"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteri soyadı"
                />
              </div>
            </div>

            <!-- Ünvan ve Cinsiyet -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ünvan
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ünvan"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cinsiyet
                </label>
                <select
                  v-model="form.gender"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
            </div>

            <!-- Doğum Tarihi ve Kimlik No -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Doğum Tarihi
                </label>
                <input
                  v-model="form.birth_date"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kimlik Numarası
                </label>
                <input
                  v-model="form.identity_number"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="11 haneli kimlik numarası"
                />
              </div>
            </div>
          </div>

          <!-- İletişim Bilgileri -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">İletişim Bilgileri</h3>
            
            <!-- Email Telefon -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-posta *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefon
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5XX XXX XX XX"
                />
              </div>
            </div>

            <!-- Website ve Dil -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  v-model="form.website"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dil
                </label>
                <input
                  v-model="form.language"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Türkçe, İngilizce, vb."
                />
              </div>
            </div>
          </div>

          <!-- İş Bilgileri -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">İş ve Kaynak Bilgileri</h3>
            
            <!-- Meslek ve Kaynak -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meslek
                </label>
                <input
                  v-model="form.job"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Meslek"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kaynak
                </label>
                <select
                  v-model="form.source_id"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Kaynak seçiniz</option>
                  <option v-for="source in sources" :key="source.id" :value="source.id">
                    {{ source.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Referans Müşteri ve Sorumlu Kullanıcı -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Referans Müşteri
                </label>
                <select
                  v-model="form.referance_customer"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Referans müşteri seçiniz</option>
                  <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.name }} {{ customer.surname }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sorumlu Kullanıcı
                </label>
                <select
                  v-model="form.relevant_user"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Kullanıcı seçiniz</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Dinamik Alanlar -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Dinamik Alanlar</h3>
            
            <div v-if="loadingDynamicFields" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="text-gray-600 dark:text-gray-400 mt-2">Dinamik alanlar yükleniyor...</p>
            </div>
            
            <div v-else-if="dynamicFields.length === 0" class="text-center py-4">
              <p class="text-gray-500 dark:text-gray-400">Henüz dinamik alan tanımlanmamış.</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="field in sortedDynamicFields" :key="field.id">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ field.name }}
                </label>
                
                <!-- Text Input -->
                <input
                  v-if="field.type === 'text'"
                  v-model="dynamicFieldValues[field.id]"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                />
                
                <!-- Number Input -->
                <input
                  v-else-if="field.type === 'number'"
                  v-model.number="dynamicFieldValues[field.id]"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                />
                
                <!-- Email Input -->
                <input
                  v-else-if="field.type === 'email'"
                  v-model="dynamicFieldValues[field.id]"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                />
                
                <!-- Phone Input -->
                <input
                  v-else-if="field.type === 'phone'"
                  v-model="dynamicFieldValues[field.id]"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                />
                
                <!-- URL Input -->
                <input
                  v-else-if="field.type === 'url'"
                  v-model="dynamicFieldValues[field.id]"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                />
                
                <!-- Date Input -->
                <input
                  v-else-if="field.type === 'date'"
                  v-model="dynamicFieldValues[field.id]"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <!-- Select Dropdown -->
                <select
                  v-else-if="field.type === 'select'"
                  v-model="dynamicFieldValues[field.id]"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option 
                    v-for="option in parseOptionsData(field.options_data)"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
                
                <!-- Checkbox -->
                <div v-else-if="field.type === 'checkbox'" class="flex items-center">
                  <input
                    v-model="dynamicFieldValues[field.id]"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ field.name }}</label>
                </div>
                
                <!-- Textarea -->
                <textarea
                  v-else-if="field.type === 'textarea'"
                  v-model="dynamicFieldValues[field.id]"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :placeholder="`${field.name} giriniz`"
                ></textarea>
                
                <!-- File Input -->
                <input
                  v-else-if="field.type === 'file'"
                  type="file"
                  @change="handleFileUpload($event, field.id)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Konum Bilgileri -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Konum Bilgileri</h3>
            
            <!-- Ülke ve İl -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ülke
                </label>
                <select
                  v-model="form.country"
                  @change="onCountryChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Ülke seçiniz</option>
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İl
                </label>
                <select
                  v-model="form.state"
                  @change="onStateChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!form.country"
                >
                  <option value="">İl seçiniz</option>
                  <option v-for="state in filteredStates" :key="state.id" :value="state.id">
                    {{ state.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- İlçe ve Mahalle -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İlçe
                </label>
                <select
                  v-model="form.city"
                  @change="onCityChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!form.state"
                >
                  <option value="">İlçe seçiniz</option>
                  <option v-for="city in filteredCities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mahalle
                </label>
                <input
                  v-model="form.district"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mahalle adı giriniz"
                />
              </div>
            </div>

            <!-- Posta Kodu ve Adres -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Posta Kodu
                </label>
                <input
                  v-model="form.postal_code"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açık Adres
                </label>
                <textarea
                  v-model="form.address"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detaylı adres bilgisi..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Durum ve Açıklama -->
          <div class="pb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Durum ve Açıklamalar</h3>
            
            <!-- Durum ve Aktiflik -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durum
                </label>
                <select
                  v-model="form.status"
                  @change="onStatusChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Durum seçiniz</option>
                  <option v-for="status in statuses" :key="status.id" :value="status.id">
                    {{ status.name }}
                  </option>
                </select>
              </div>
              <div class="flex items-center">
                <label class="flex items-center">
                  <input
                    v-model="form.isActive"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Aktif müşteri</span>
                </label>
              </div>
            </div>

            <!-- Hatırlatma Alanları -->
            <div v-if="showReminderFields" class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Hatırlatma Ayarları</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hatırlatma Tarihi ve Saati *
                  </label>
                  <input
                    v-model="reminderDateTime"
                    type="datetime-local"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Not Tipi
                  </label>
                  <input
                    v-model="selectedStatusName"
                    type="text"
                    readonly
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hatırlatma Notu *
                </label>
                <textarea
                  v-model="reminderNote"
                  rows="3"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hatırlatma için not giriniz..."
                ></textarea>
              </div>
            </div>

            <!-- Açıklama -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Müşteri hakkında notlar..."
              ></textarea>
            </div>
          </div>

          <!-- Başarı mesajı -->
          <div v-if="successMessage" class="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-6">
            {{ successMessage }}
          </div>

          <!-- Submit hatası -->
          <div v-if="submitError" class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            {{ submitError }}
          </div>

          <!-- Butonlar -->
          <div class="flex justify-end space-x-4">
            <NuxtLink
              :to="`/customers/show/${$route.params.id}`"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              İptal
            </NuxtLink>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

// Use dynamic fields composable
const { getDynamicFields, parseOptionsData } = useCustomerDynamicFields()

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const successMessage = ref('')
const submitError = ref('')

// Data sources
const countries = ref([])
const states = ref([])
const cities = ref([])
const districts = ref([])
const sources = ref([])
const statuses = ref([])
const users = ref([])
const customers = ref([])

// Dynamic fields data
const dynamicFields = ref([])
const dynamicFieldValues = ref({})
const loadingDynamicFields = ref(false)

const form = reactive({
  name: '',
  surname: '',
  title: '',
  email: '',
  gender: '',
  birth_date: '',
  phone: '',
  source_id: '',
  job: '',
  identity_number: '',
  referance_customer: '',
  language: '',
  isActive: true,
  status: '',
  website: '',
  country: '',
  state: '',
  city: '',
  district: '',
  postal_code: '',
  address: '',
  relevant_user: '',
  description: ''
})

// Reminder fields
const showReminderFields = ref(false)
const reminderDateTime = ref('')
const reminderNote = ref('')
const selectedStatusName = ref('')

// Filtered location arrays
const filteredStates = computed(() => {
  return form.country ? states.value.filter(s => s.country === parseInt(form.country)) : []
})

const filteredCities = computed(() => {
  return form.state ? cities.value.filter(c => c.state === parseInt(form.state)) : []
})

const filteredDistricts = computed(() => {
  return form.city ? districts.value.filter(d => d.city === parseInt(form.city)) : []
})

// Location change handlers
const onCountryChange = () => {
  form.state = ''
  form.city = ''
  form.district = ''
}

const onStateChange = () => {
  form.city = ''
  form.district = ''
}

const onCityChange = () => {
  // District is now a text field, no need to reset
}

// Check if selected status is remindable
const onStatusChange = () => {
  console.log('Status changed to:', form.status)
  console.log('All statuses:', statuses.value)
  
  const selectedStatus = statuses.value.find(s => s.id === parseInt(form.status))
  console.log('Selected status:', selectedStatus)
  
  if (selectedStatus) {
    // Check both is_remindable and isRemindable (different API response formats)
    const isRemindable = selectedStatus.is_remindable || selectedStatus.isRemindable || false
    console.log('Is remindable:', isRemindable)
    
    showReminderFields.value = isRemindable
    selectedStatusName.value = selectedStatus.name
    
    if (!isRemindable) {
      // Reset reminder fields if not remindable
      reminderDateTime.value = ''
      reminderNote.value = ''
      selectedStatusName.value = ''
    }
  } else {
    showReminderFields.value = false
    reminderDateTime.value = ''
    reminderNote.value = ''
    selectedStatusName.value = ''
  }
}

const loadCustomer = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const customerId = route.params.id
    const api = useApi()
    const response = await api(`/customers/${customerId}`)
    
    // Form verilerini set et
    Object.assign(form, {
      name: response.name || '',
      surname: response.surname || '',
      title: response.title || '',
      email: response.email || '',
      gender: response.gender || '',
      birth_date: response.birthDate || response.birth_date || '',
      phone: response.phone || '',
      source_id: response.sourceId || response.source_id || '',
      job: response.job || '',
      identity_number: response.identityNumber || response.identity_number || '',
      referance_customer: response.referanceCustomer || response.referance_customer || '',
      language: response.language || '',
      isActive: response.isActive !== false,
      status: response.status || '',
      website: response.website || '',
      country: response.country || '',
      state: response.state || '',
      city: response.city || '',
      district: response.district || '',
      postal_code: response.postalCode || response.postal_code || '',
      address: response.address || '',
      relevant_user: response.relevantUser || response.relevant_user || '',
      description: response.description || ''
    })
    
    // Check if loaded status is remindable  
    // Note: loadDropdownData is already called in onMounted, no need to call again
    if (form.status && statuses.value.length > 0) {
      const selectedStatus = statuses.value.find(s => s.id === parseInt(form.status))
      console.log('Customer current status:', selectedStatus)
      
      if (selectedStatus) {
        // Check both is_remindable and isRemindable (different API response formats)
        const isRemindable = selectedStatus.is_remindable || selectedStatus.isRemindable || false
        if (isRemindable) {
          showReminderFields.value = true
          selectedStatusName.value = selectedStatus.name
        }
      }
    }
    
    // Load customer dynamic fields from response
    if (response.dynamicFieldValues && response.dynamicFieldValues.length > 0) {
      // Reset dynamic field values
      dynamicFieldValues.value = {}
      
      // Set values from customer's dynamic fields
      response.dynamicFieldValues.forEach(field => {
        if (field.customer_dynamic_field) {
          dynamicFieldValues.value[field.customer_dynamic_field] = field.options_data || field.file || ''
        }
      })
    }
    
  } catch (err) {
    console.error('Müşteri yükleme hatası:', err)
    error.value = 'Müşteri bilgileri yüklenemedi.'
  } finally {
    loading.value = false
  }
}

// Load dynamic fields
const loadDynamicFields = async () => {
  try {
    loadingDynamicFields.value = true
    const fields = await getDynamicFields()
    dynamicFields.value = fields.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error loading dynamic fields:', error)
  } finally {
    loadingDynamicFields.value = false
  }
}


// Computed properties
const sortedDynamicFields = computed(() => {
  return dynamicFields.value.sort((a, b) => a.order - b.order)
})

// Handle file upload
const handleFileUpload = (event, fieldId) => {
  const file = event.target.files[0]
  if (file) {
    // For now, just store the file name
    // In a real implementation, you'd upload the file to the server
    dynamicFieldValues.value[fieldId] = file.name
  }
}

const loadDropdownData = async () => {
  try {
    const api = useApi()
    // Paralel API çağrıları yap
    const [
      countriesRes,
      statesRes,
      citiesRes,
      districtsRes,
      sourcesRes,
      statusesRes,
      usersRes,
      customersRes
    ] = await Promise.all([
      api('/countries').catch(() => []),
      api('/states').catch(() => []),
      api('/cities').catch(() => []),
      api('/districts').catch(() => []),
      api('/sources').catch(() => []),
      api('/statuses').catch((err) => {
        console.error('Status API error:', err)
        // Fallback to static data if API fails
        return [
          { id: 1, name: 'Yeni', is_remindable: false },
          { id: 2, name: 'Potansiyel', is_remindable: true },
          { id: 3, name: 'Müşteri', is_remindable: false },
          { id: 4, name: 'VIP', is_remindable: false },
          { id: 5, name: 'Eski Müşteri', is_remindable: true },
          { id: 6, name: 'İptal', is_remindable: false }
        ]
      }),
      api('/users').catch(() => []),
      api('/customers').catch(() => [])
    ])
    
    countries.value = countriesRes
    states.value = statesRes
    cities.value = citiesRes
    districts.value = districtsRes
    sources.value = sourcesRes.data || sourcesRes || []
    statuses.value = statusesRes.data || statusesRes || []
    console.log('Loaded statuses:', statuses.value)
    users.value = usersRes.data || usersRes
    customers.value = customersRes.data || customersRes
    
  } catch (err) {
    console.error('Dropdown verileri yükleme hatası:', err)
  }
}

const saveCustomer = async () => {
  try {
    // Validate reminder fields if status is remindable
    if (showReminderFields.value) {
      if (!reminderDateTime.value || !reminderNote.value) {
        submitError.value = 'Hatırlatma durumu seçildiğinde tarih ve not alanları zorunludur.'
        return
      }
    }
    
    saving.value = true
    submitError.value = ''
    successMessage.value = ''
    
    const customerId = route.params.id
    // Add dynamic fields if any have values
    const dynamicFieldsData = []
    for (const field of dynamicFields.value) {
      const value = dynamicFieldValues.value[field.id]
      if (value !== undefined && value !== null && value !== '') {
        dynamicFieldsData.push({
          customer_dynamic_field: field.id,
          name: field.name,
          type: field.type,
          file: field.type === 'file' ? value : undefined,
          options_data: field.type === 'file' ? undefined : value, // Use value for non-file fields
          order: field.order
        })
      }
    }

    const updateData = {
      name: form.name.trim(),
      surname: form.surname.trim(),
      title: form.title?.trim() || null,
      email: form.email.trim(),
      gender: form.gender || null,
      birthDate: form.birth_date || null,
      phone: form.phone?.trim() || null,
      sourceId: form.source_id ? parseInt(form.source_id) : null,
      job: form.job?.trim() || null,
      identityNumber: form.identity_number ? parseInt(form.identity_number) : null,
      referanceCustomer: form.referance_customer ? parseInt(form.referance_customer) : null,
      language: form.language ? parseInt(form.language) : null,
      isActive: form.isActive,
      status: form.status ? parseInt(form.status) : null,
      website: form.website?.trim() || null,
      country: form.country ? parseInt(form.country) : null,
      state: form.state ? parseInt(form.state) : null,
      city: form.city ? parseInt(form.city) : null,
      district: form.district?.trim() || null,
      postalCode: form.postal_code ? parseInt(form.postal_code) : null,
      address: form.address?.trim() || null,
      relevantUser: form.relevant_user ? parseInt(form.relevant_user) : null,
      description: form.description?.trim() || null
    }

    // Add dynamic fields to update data
    if (dynamicFieldsData.length > 0) {
      updateData.dynamicFields = dynamicFieldsData
    }
    
    const api = useApi()
    await api(`/customers/${customerId}`, {
      method: 'PATCH',
      body: updateData
    })
    
    // Create customer note if reminder fields are filled
    if (showReminderFields.value && reminderDateTime.value && reminderNote.value) {
      try {
        // Format the datetime to ISO string format
        const formattedDateTime = new Date(reminderDateTime.value).toISOString()
        
        const noteData = {
          customer: parseInt(customerId),
          note: reminderNote.value.trim(),
          isReminding: true,
          remindingAt: formattedDateTime,
          noteType: selectedStatusName.value
        }
        
        console.log('Sending customer note data:', noteData)
        
        await api('/customer-notes', {
          method: 'POST',
          body: noteData
        })
        
        console.log('Customer note created successfully')
      } catch (noteError) {
        console.error('Customer note creation error:', noteError)
        console.error('Error response data:', noteError.data)
        console.error('Error response status:', noteError.status)
        console.error('Full error object:', noteError)
        
        // Check if there's a specific error message from the API
        const errorMessage = noteError.data?.message || noteError.data?.error || 'Bilinmeyen hata'
        
        // Don't block the main save operation if note creation fails
        // But show a warning to the user with specific error
        submitError.value = `Müşteri bilgileri güncellendi ancak hatırlatma notu kaydedilemedi: ${errorMessage}`
      }
    }
    
    successMessage.value = 'Müşteri bilgileri başarıyla güncellendi!'
    
    // 2 saniye sonra detay sayfasına yönlendir
    setTimeout(() => {
      navigateTo(`/customers/show/${customerId}`)
    }, 2000)
    
  } catch (err) {
    console.error('Kayıt hatası:', err)
    submitError.value = 'Güncelleme sırasında bir hata oluştu.'
  } finally {
    saving.value = false
  }
}

// Sayfa yüklendiğinde verileri getir
onMounted(async () => {
  // First load dropdown data (including statuses)
  await loadDropdownData()
  // Then load dynamic fields and customer data in parallel
  await Promise.all([
    loadDynamicFields(),
    loadCustomer()
  ])
})

useHead({
  title: 'Müşteri Düzenle - Valdori CRM'
})
</script> 