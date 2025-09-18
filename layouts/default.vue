<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Main Content -->
    <div 
      class="transition-all duration-300 ease-in-out"
      :class="[sidebarOpen ? 'lg:ml-64' : 'lg:ml-20']"
    >
      <!-- Header -->
      <AppHeader />
      
      <!-- Page Content -->
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>
    
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="mobileSidebarOpen" 
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      @click="closeMobileSidebar"
    ></div>
    
    <!-- Fraud Alert Popup -->
    <FraudAlertPopup
      :is-open="fraudAlertPopup"
      :alert="currentFraudAlert"
      :loading="fraudAlertLoading"
      @dismiss="dismissFraudAlert"
      @check="checkFraudAlert"
    />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted } from 'vue'
import { useFraudAlerts } from '~/composables/useFraudAlerts'
import FraudAlertPopup from '~/components/FraudAlertPopup.vue'

// Sidebar state
const sidebarOpen = ref(true)
const mobileSidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const openMobileSidebar = () => {
  mobileSidebarOpen.value = true
}

const closeMobileSidebar = () => {
  mobileSidebarOpen.value = false
}

// Fraud Alert System
const {
  showPopup: fraudAlertPopup,
  currentAlert: currentFraudAlert,
  loading: fraudAlertLoading,
  checkForNewAlerts,
  dismissPopup,
  markAsChecked,
  getUnreadCount
} = useFraudAlerts()

// Check for fraud alerts every 30 seconds
let fraudAlertInterval = null

const dismissFraudAlert = () => {
  dismissPopup()
}

const checkFraudAlert = async () => {
  if (currentFraudAlert.value) {
    fraudAlertLoading.value = true
    await markAsChecked(currentFraudAlert.value.id)
    fraudAlertLoading.value = false
  }
}

onMounted(async () => {
  // Initial check for fraud alerts
  await checkForNewAlerts()
  await getUnreadCount()
  
  // Set up interval to check every 30 seconds
  fraudAlertInterval = setInterval(async () => {
    await checkForNewAlerts()
  }, 30000)
})

onUnmounted(() => {
  // Clean up interval
  if (fraudAlertInterval) {
    clearInterval(fraudAlertInterval)
    fraudAlertInterval = null
  }
})

// Provide sidebar state to child components
provide('sidebar', {
  sidebarOpen,
  mobileSidebarOpen,
  toggleSidebar,
  openMobileSidebar,
  closeMobileSidebar
})
</script> 