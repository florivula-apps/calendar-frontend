import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { useTimeSlots, useCreateTimeSlot, useDeleteTimeSlot } from '@/hooks/useCalendar';
import { format, parseISO } from 'date-fns';
import { Plus, Trash2, Clock, Calendar as CalendarIcon, X } from 'lucide-react';
import type { CreateTimeSlotInput } from '@/types';

export default function Availability() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const { data: timeSlots = [], refetch } = useTimeSlots();
  const createTimeSlot = useCreateTimeSlot();
  const deleteTimeSlot = useDeleteTimeSlot();

  const handleCreate = async () => {
    if (!selectedDate) return;

    const data: CreateTimeSlotInput = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
    };

    try {
      await createTimeSlot.mutateAsync(data);
      refetch();
      setShowForm(false);
      setSelectedDate(undefined);
      setStartTime('09:00');
      setEndTime('10:00');
    } catch (error) {
      console.error('Failed to create time slot:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this time slot?')) return;

    try {
      await deleteTimeSlot.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error('Failed to delete time slot:', error);
    }
  };

  // Group slots by date
  const slotsByDate = timeSlots.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, typeof timeSlots>);

  const sortedDates = Object.keys(slotsByDate).sort();

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Availability</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your available time slots
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Create Form (Drawer-style) */}
        {showForm && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Add Time Slot</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border bg-white mx-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={!selectedDate || createTimeSlot.isPending}
                className="w-full h-12"
              >
                {createTimeSlot.isPending ? 'Creating...' : 'Create Time Slot'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Time Slots List */}
        {sortedDates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-medium text-slate-900 mb-1">No time slots yet</h3>
              <p className="text-sm text-slate-500 mb-4">
                Create your first available time slot to start accepting bookings
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <CalendarIcon className="w-4 h-4 text-slate-500" />
                  <h3 className="font-semibold text-sm">
                    {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                  </h3>
                </div>
                <div className="space-y-2">
                  {slotsByDate[date].map((slot) => (
                    <Card key={slot.id} className={slot.isBooked ? 'bg-slate-50' : ''}>
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <div>
                              <div className="font-medium text-sm">
                                {slot.startTime} - {slot.endTime}
                              </div>
                              {slot.isBooked && (
                                <div className="text-xs text-slate-500">Booked</div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(slot.id)}
                            disabled={slot.isBooked || deleteTimeSlot.isPending}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-20"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
