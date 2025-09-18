<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
      sidebarOpen ? 'w-64' : 'w-20',
      mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <div class="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
          <span class="text-white font-bold">V</span>
        </div>
        <transition name="fade">
          <span v-if="sidebarOpen" class="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
            Valdori CRM
          </span>
        </transition>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <button
        v-for="item in navigationItems"
        :key="item.name"
        @click="navigateTo(item.href)"
        :class="[
          'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer w-full text-left',
          route.path === item.href
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
        ]"
      >
        <component
          :is="item.icon"
          :class="[
            'flex-shrink-0 w-5 h-5',
            sidebarOpen ? 'mr-3' : 'mx-auto'
          ]"
        />
        <transition name="fade">
          <span v-if="sidebarOpen">{{ item.name }}</span>
        </transition>
      </button>
    </nav>

    <!-- User Profile -->
    <div class="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <UserIcon class="w-5 h-5 text-gray-600" />
          </div>
        </div>
        <transition name="fade">
          <div v-if="sidebarOpen" class="ml-3">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ authStore.user?.name || 'Demo User' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ authStore.user?.email || 'demo@example.com' }}
            </p>
          </div>
        </transition>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { inject } from 'vue'
import { useAuthStore } from '~/stores/auth'
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  BellIcon,
  TagIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const sidebar = inject('sidebar')
const { sidebarOpen, mobileSidebarOpen } = sidebar
const router = useRouter()
const route = useRoute()

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Müşteriler', href: '/customers', icon: UsersIcon },
  { name: 'Hatırlatmalar', href: '/reminders', icon: BellIcon },
  { name: 'Satışlar', href: '/sales', icon: ShoppingBagIcon },
  { name: 'Toplantılar', href: '/meetings', icon: CalendarIcon },
  { name: 'Ödemeler', href: '/payments', icon: CurrencyDollarIcon },
  { name: 'Kullanıcılar', href: '/users', icon: UserIcon },
  { name: 'Ürünler', href: '/products', icon: ShoppingBagIcon },
  { name: 'Durumlar', href: '/statuses', icon: TagIcon },
  { name: 'Hastaneler', href: '/hospitals', icon: BuildingOffice2Icon },
  { name: 'Branşlar', href: '/branches', icon: BuildingOfficeIcon },
  { name: 'Doktorlar', href: '/doctors', icon: UserGroupIcon },
  { name: 'Dinamik Alanlar', href: '/dynamic-fields', icon: WrenchScrewdriverIcon },
  { name: 'Fraud Alerts', href: '/fraud-alerts', icon: ExclamationTriangleIcon },
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 