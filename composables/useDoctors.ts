export interface Doctor {
  id: number
  name: string
  branchId?: number
  branch?: {
    id: number
    name: string
    code: string
    description?: string
  }
  doctor2Branches?: Array<{
    id: number
    doctorId: number
    branchId: number
    branch: {
      id: number
      name: string
      code: string
    }
  }>
  doctor2Hospitals?: Array<{
    id: number
    doctorId: number
    hospitalId: number
    hospital: {
      id: number
      name: string
      code: string
      address?: string
    }
  }>
  branchIds?: number[]
  hospitalIds?: number[]
  createdAt: Date
  updatedAt: Date
}

export const useDoctors = () => {
  const $api = useApi()
  const doctors = ref<Doctor[]>([])
  const allDoctors = ref<Doctor[]>([]) // Store all doctors for search
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDoctors = async () => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $api('/doctors', {
        params: {
          page: 1,
          limit: 10000 // Fetch all doctors at once
        }
      })

      // API returns { data: [...], meta: {...} }
      if (response && response.data && Array.isArray(response.data)) {
        allDoctors.value = response.data
        doctors.value = response.data
      } else if (Array.isArray(response)) {
        allDoctors.value = response
        doctors.value = response
      } else {
        console.warn('Unexpected doctors response structure:', response)
        allDoctors.value = []
        doctors.value = []
      }

      return allDoctors.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch doctors'
      allDoctors.value = []
      doctors.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDoctor = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/doctors/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch doctor'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createDoctor = async (data: Partial<Doctor>) => {
    loading.value = true
    error.value = null
    try {
      // Clean up undefined values from the request body
      const requestBody = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {} as any)

      const response = await $api('/doctors', {
        method: 'POST',
        body: requestBody
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create doctor'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDoctor = async (id: number, data: Partial<Doctor>) => {
    loading.value = true
    error.value = null
    try {
      // Clean up undefined values from the request body
      const requestBody = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {} as any)

      const response = await $api(`/doctors/${id}`, {
        method: 'PATCH',
        body: requestBody
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update doctor'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDoctor = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/doctors/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete doctor'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    doctors,
    allDoctors,
    loading,
    error,
    fetchDoctors,
    fetchDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor
  }
}