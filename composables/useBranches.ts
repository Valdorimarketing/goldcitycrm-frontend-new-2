export interface Branch {
  id: number
  hospitalId: number
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  hospital?: any
}

export const useBranches = () => {
  const $api = useApi()
  const branches = ref<Branch[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBranches = async (hospitalId?: number, limit: number = 100, page: number = 1) => {
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (hospitalId) {
        params.append('hospitalId', hospitalId.toString())
      }

      const url = `/branches?${params.toString()}`
      const response: any = await $api(url)

      console.log('Branches API response:', response)

      // API returns { data: [...], meta: {...} } just like hospitals
      if (response && response.data && Array.isArray(response.data)) {
        branches.value = response.data
      } else if (Array.isArray(response)) {
        branches.value = response
      } else {
        console.warn('Unexpected branch response structure:', response)
        branches.value = []
      }

      console.log(`Total branches fetched: ${branches.value.length}`)
      return branches.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch branches'
      branches.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchBranch = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/branches/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch branch'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBranch = async (data: Partial<Branch>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api('/branches', {
        method: 'POST',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create branch'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBranch = async (id: number, data: Partial<Branch>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/branches/${id}`, {
        method: 'PATCH',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update branch'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBranch = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/branches/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete branch'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    branches,
    loading,
    error,
    fetchBranches,
    fetchBranch,
    createBranch,
    updateBranch,
    deleteBranch
  }
}