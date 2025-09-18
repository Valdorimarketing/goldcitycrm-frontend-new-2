import { defineStore } from 'pinia'
import type { SalesProduct, PaginatedResponse } from '~/types'

export const useSalesProductsStore = defineStore('salesProducts', () => {
  const salesProducts = ref<SalesProduct[]>([])
  const currentSalesProduct = ref<SalesProduct | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  // Get all sales products
  const fetchSalesProducts = async (page = 1, limit = 10) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const query: any = { page, limit }
      
      const response = await $fetch<PaginatedResponse<SalesProduct>>('/sales-products', {
        baseURL: config.public.apiBase,
        query,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      // Eğer response direkt array ise
      if (Array.isArray(response)) {
        salesProducts.value = response
      } else if (response.data) {
        salesProducts.value = response.data
      }
      
      pagination.value = {
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10,
        totalPages: response.totalPages || 1
      }
    } catch (error) {
      console.error('Error fetching sales products:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Get sales product by ID
  const fetchSalesProduct = async (id: number) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<SalesProduct>(`/sales-products/${id}`, {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      currentSalesProduct.value = response
      return response
    } catch (error) {
      console.error('Error fetching sales product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Create sales product
  const createSalesProduct = async (productData: Partial<SalesProduct>) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<SalesProduct>('/sales-products', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: productData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      salesProducts.value.unshift(response)
      return response
    } catch (error) {
      console.error('Error creating sales product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Update sales product
  const updateSalesProduct = async (id: number, productData: Partial<SalesProduct>) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<SalesProduct>(`/sales-products/${id}`, {
        method: 'PATCH',
        baseURL: config.public.apiBase,
        body: productData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      const index = salesProducts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        salesProducts.value[index] = response
      }
      
      if (currentSalesProduct.value?.id === id) {
        currentSalesProduct.value = response
      }
      
      return response
    } catch (error) {
      console.error('Error updating sales product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Delete sales product
  const deleteSalesProduct = async (id: number) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      await $fetch(`/sales-products/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      salesProducts.value = salesProducts.value.filter(p => p.id !== id)
      
      if (currentSalesProduct.value?.id === id) {
        currentSalesProduct.value = null
      }
    } catch (error) {
      console.error('Error deleting sales product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    salesProducts,
    currentSalesProduct,
    loading,
    pagination,
    fetchSalesProducts,
    fetchSalesProduct,
    createSalesProduct,
    updateSalesProduct,
    deleteSalesProduct
  }
})