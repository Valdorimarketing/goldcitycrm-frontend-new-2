import { defineStore } from 'pinia'
import type { Meeting, CreateMeetingDto, UpdateMeetingDto, PaginatedResponse } from '~/types'

export const useMeetingsStore = defineStore('meetings', () => {
  const meetings = ref<Meeting[]>([])
  const currentMeeting = ref<Meeting | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  // Get all meetings with filters
  const fetchMeetings = async (page = 1, limit = 10, filters?: {
    customer?: number
    user?: number
    status?: number
    salesProductId?: number
  }) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const query: any = { page, limit, ...filters }
      
      const response = await $fetch<PaginatedResponse<Meeting>>('/meetings', {
        baseURL: config.public.apiBase,
        query,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      // Eğer response direkt array ise
      if (Array.isArray(response)) {
        meetings.value = response
      } else if (response.data) {
        meetings.value = response.data
      }
      
      pagination.value = {
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10,
        totalPages: response.totalPages || 1
      }
    } catch (error) {
      console.error('Error fetching meetings:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Get meeting by ID
  const fetchMeeting = async (id: number) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<Meeting>(`/meetings/${id}`, {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      currentMeeting.value = response
      return response
    } catch (error) {
      console.error('Error fetching meeting:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Create meeting
  const createMeeting = async (meetingData: CreateMeetingDto) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<Meeting>('/meetings', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: meetingData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      meetings.value.unshift(response)
      return response
    } catch (error) {
      console.error('Error creating meeting:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Update meeting
  const updateMeeting = async (id: number, meetingData: UpdateMeetingDto) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<Meeting>(`/meetings/${id}`, {
        method: 'PATCH',
        baseURL: config.public.apiBase,
        body: meetingData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      const index = meetings.value.findIndex(m => m.id === id)
      if (index !== -1) {
        meetings.value[index] = response
      }
      
      if (currentMeeting.value?.id === id) {
        currentMeeting.value = response
      }
      
      return response
    } catch (error) {
      console.error('Error updating meeting:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Delete meeting
  const deleteMeeting = async (id: number) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      await $fetch(`/meetings/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      meetings.value = meetings.value.filter(m => m.id !== id)
      
      if (currentMeeting.value?.id === id) {
        currentMeeting.value = null
      }
    } catch (error) {
      console.error('Error deleting meeting:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    meetings,
    currentMeeting,
    loading,
    pagination,
    fetchMeetings,
    fetchMeeting,
    createMeeting,
    updateMeeting,
    deleteMeeting
  }
})