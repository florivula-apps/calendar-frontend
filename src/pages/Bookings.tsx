import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBookings, useApproveBooking, useRejectBooking } from '@/hooks/useCalendar';
import { format, parseISO, isToday, isFuture, isPast } from 'date-fns';
import { Calendar, Clock, Mail, Phone, MessageSquare, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Booking } from '@/types';

export default function Bookings() {
  const [showPast, setShowPast] = useState(false);
  const { data: bookings = [], refetch } = useBookings();
  const approveBooking = useApproveBooking();
  const rejectBooking = useRejectBooking();

  const handleApprove = async (id: number) => {
    try {
      await approveBooking.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error('Failed to approve booking:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectBooking.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error('Failed to reject booking:', error);
    }
  };

  // Filter bookings
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const approvedBookings = bookings.filter(b => {
    if (b.status !== 'approved') return false;
    const bookingDate = parseISO(b.date);
    return isFuture(bookingDate) || isToday(bookingDate);
  });
  const pastBookings = bookings.filter(b => {
    if (b.status !== 'approved') return false;
    const bookingDate = parseISO(b.date);
    return isPast(bookingDate) && !isToday(bookingDate);
  });

  const renderBookingCard = (booking: Booking, showActions: boolean = false) => (
    <Card key={booking.id} className="mb-3">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-base">{booking.name}</h3>
            <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{booking.email}</span>
            </div>
            {booking.phone && (
              <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{booking.phone}</span>
              </div>
            )}
          </div>
          <Badge 
            variant={
              booking.status === 'approved' ? 'default' : 
              booking.status === 'pending' ? 'secondary' : 
              'destructive'
            }
            className="capitalize"
          >
            {booking.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="font-medium">
              {format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{booking.startTime} - {booking.endTime}</span>
          </div>
        </div>

        {booking.message && (
          <div className="p-3 bg-slate-50 rounded-lg mb-3">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500 mt-0.5" />
              <p className="text-sm text-slate-700">{booking.message}</p>
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => handleApprove(booking.id)}
              disabled={approveBooking.isPending}
              className="flex-1 h-10"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              onClick={() => handleReject(booking.id)}
              disabled={rejectBooking.isPending}
              variant="outline"
              className="flex-1 h-10 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your meeting requests
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Pending Requests */}
        {pendingBookings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Pending Requests</h2>
              <Badge variant="secondary" className="text-xs">
                {pendingBookings.length}
              </Badge>
            </div>
            {pendingBookings.map(booking => renderBookingCard(booking, true))}
          </section>
        )}

        {/* Upcoming Meetings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Upcoming</h2>
            <Badge variant="default" className="text-xs">
              {approvedBookings.length}
            </Badge>
          </div>
          {approvedBookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-slate-500">
                No upcoming meetings
              </CardContent>
            </Card>
          ) : (
            approvedBookings.map(booking => renderBookingCard(booking))
          )}
        </section>

        {/* Past Meetings */}
        {pastBookings.length > 0 && (
          <section>
            <button
              onClick={() => setShowPast(!showPast)}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <h2 className="text-lg font-semibold">Past Meetings</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {pastBookings.length}
                </Badge>
                {showPast ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                )}
              </div>
            </button>
            {showPast && pastBookings.map(booking => renderBookingCard(booking))}
          </section>
        )}

        {bookings.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-medium text-slate-900 mb-1">No bookings yet</h3>
              <p className="text-sm text-slate-500">
                Bookings will appear here once clients start booking meetings
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
