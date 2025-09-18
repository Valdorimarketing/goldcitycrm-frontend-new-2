export const useApi = () => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      // Get token from cookie or localStorage
      const token = useCookie('auth-token').value || 
                   (process.client ? localStorage.getItem('auth-token') : null)
      
      if (token) {
        // Add Authorization header
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      }
    },
    onResponseError({ response }) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.error('Unauthorized - Token may be expired')
        
        // Clear auth and redirect to login
        if (process.client) {
          const authStore = useAuthStore()
          authStore.logout()
          
          // Redirect to login page
          navigateTo('/login')
        }
      }
    }
  })
  
  return api
}