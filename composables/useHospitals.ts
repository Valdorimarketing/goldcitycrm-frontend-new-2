export interface Hospital {
  id: number
  name: string
  code: string
  address?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export const useHospitals = () => {
  const $api = useApi()
  const hospitals = ref<Hospital[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchHospitals = async (limit: number = 100, page: number = 1) => {
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const url = `/hospitals?${params.toString()}`
      const response: any = await $api(url)

      console.log('Hospitals API response:', response)

      // API returns { data: [...], meta: {...} }
      if (response && response.data && Array.isArray(response.data)) {
        hospitals.value = response.data
      } else if (Array.isArray(response)) {
        hospitals.value = response
      } else {
        console.warn('Unexpected response structure:', response)
        hospitals.value = []
      }

      console.log(`Total hospitals fetched: ${hospitals.value.length}`)
      return hospitals.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch hospitals'
      hospitals.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchHospital = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/hospitals/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch hospital'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createHospital = async (data: Partial<Hospital>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api('/hospitals', {
        method: 'POST',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create hospital'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateHospital = async (id: number, data: Partial<Hospital>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/hospitals/${id}`, {
        method: 'PATCH',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update hospital'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteHospital = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/hospitals/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete hospital'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    hospitals,
    loading,
    error,
    fetchHospitals,
    fetchHospital,
    createHospital,
    updateHospital,
    deleteHospital
  }
}