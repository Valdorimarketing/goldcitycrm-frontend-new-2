import { defineStore } from 'pinia'
import type { Customer, ApiResponse, PaginatedResponse } from '~/types'

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  // Get all customers
  const fetchCustomers = async (page = 1, limit = 10) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<PaginatedResponse<Customer>>('/customers', {
        baseURL: config.public.apiBase,
        query: { page, limit },
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      customers.value = response.data
      pagination.value = {
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Get customer by ID
  const fetchCustomer = async (id: number) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<Customer>(`/customers/${id}`, {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      currentCustomer.value = response
      return response
    } catch (error) {
      console.error('Error fetching customer:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Create customer
  const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<Customer>('/customers', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: customerData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      customers.value.unshift(response)
      return response
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Update customer
  const updateCustomer = async (id: number, customerData: Partial<Customer>) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<Customer>(`/customers/${id}`, {
        method: 'PATCH',
        baseURL: config.public.apiBase,
        body: customerData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      const index = customers.value.findIndex(c => c.id === id)
      if (index !== -1) {
        customers.value[index] = response
      }
      
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = response
      }
      
      return response
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Delete customer
  const deleteCustomer = async (id: number) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      await $fetch(`/customers/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      customers.value = customers.value.filter(c => c.id !== id)
      
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = null
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    customers: readonly(customers),
    currentCustomer: readonly(currentCustomer),
    loading: readonly(loading),
    pagination: readonly(pagination),
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
  }
}) 