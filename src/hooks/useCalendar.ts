import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { 
  Booking, 
  TimeSlot, 
  AvailabilitySlot, 
  CreateBookingInput, 
  CreateTimeSlotInput 
} from '../types';

// Public
export function useAvailability(date: string) {
  return useQuery<AvailabilitySlot[]>({
    queryKey: ['availability', date],
    queryFn: () => api.get(`/calendar/availability?date=${date}`).then(r => r.data),
    enabled: !!date,
  });
}

export function useCreateBooking() {
  return useMutation<Booking, Error, CreateBookingInput>({
    mutationFn: (data) => api.post('/calendar/book', data).then(r => r.data),
  });
}

// Admin (protected)
export function useBookings(status?: string) {
  return useQuery<Booking[]>({
    queryKey: ['bookings', status],
    queryFn: () => api.get(`/calendar/bookings${status ? `?status=${status}` : ''}`).then(r => r.data),
  });
}

export function useApproveBooking() {
  const queryClient = useQueryClient();
  return useMutation<Booking, Error, number>({
    mutationFn: (id: number) => api.put(`/calendar/bookings/${id}/approve`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();
  return useMutation<Booking, Error, number>({
    mutationFn: (id: number) => api.put(`/calendar/bookings/${id}/reject`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useTimeSlots() {
  return useQuery<TimeSlot[]>({
    queryKey: ['timeSlots'],
    queryFn: () => api.get('/calendar/slots').then(r => r.data),
  });
}

export function useCreateTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation<TimeSlot, Error, CreateTimeSlotInput>({
    mutationFn: (data) => api.post('/calendar/slots', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timeSlots'] }),
  });
}

export function useDeleteTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id: number) => api.delete(`/calendar/slots/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timeSlots'] }),
  });
}
