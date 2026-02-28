import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAvailability, useCreateBooking } from '@/hooks/useCalendar';
import { format } from 'date-fns';
import { CalendarIcon, Clock, User, MessageSquare, Check } from 'lucide-react';

type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

interface BookingData {
  name: string;
  email: string;
  phone: string;
  date: Date | undefined;
  timeSlot: { startTime: string; endTime: string } | null;
  message: string;
}

export default function BookMeeting() {
  const navigate = useNavigate();
  const [step, setStep] = useState<BookingStep>(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    date: undefined,
    timeSlot: null,
    message: '',
  });

  const { data: availability = [] } = useAvailability(
    bookingData.date ? format(bookingData.date, 'yyyy-MM-dd') : ''
  );
  const createBooking = useCreateBooking();

  const handleNext = () => {
    if (step < 6) {
      setStep((prev) => (prev + 1) as BookingStep);
    }
  };

  const handleSubmit = async () => {
    if (!bookingData.date || !bookingData.timeSlot) return;

    try {
      await createBooking.mutateAsync({
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone || undefined,
        date: format(bookingData.date, 'yyyy-MM-dd'),
        startTime: bookingData.timeSlot.startTime,
        endTime: bookingData.timeSlot.endTime,
        message: bookingData.message || undefined,
      });
      setStep(6);
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  const isStep1Valid = bookingData.name && bookingData.email;
  const isStep2Valid = bookingData.date;
  const isStep3Valid = bookingData.timeSlot;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Progress Indicator */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Step {step} of 6
          </span>
          <span className="text-sm text-slate-500">
            {Math.round((step / 6) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Step 1: Contact Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <CardTitle>Your Information</CardTitle>
              </div>
              <CardDescription>
                Let's start with your contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  className="h-12 text-base"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <CardTitle>Select a Date</CardTitle>
              </div>
              <CardDescription>
                Choose your preferred date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={bookingData.date}
                onSelect={(date) => {
                  setBookingData({ ...bookingData, date, timeSlot: null });
                }}
                disabled={(date) => date < new Date()}
                className="rounded-md border mx-auto"
              />
            </CardContent>
          </Card>
        )}

        {/* Step 3: Time Slot Selection */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <CardTitle>Select a Time</CardTitle>
              </div>
              <CardDescription>
                {bookingData.date && format(bookingData.date, 'EEEE, MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availability.length === 0 ? (
                <p className="text-center text-slate-500 py-8">
                  No available time slots for this date
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availability.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setBookingData({ ...bookingData, timeSlot: slot })}
                      className={`p-4 rounded-lg border-2 text-center transition-all min-h-[60px] ${
                        bookingData.timeSlot?.startTime === slot.startTime
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-sm font-medium">{slot.startTime}</div>
                      <div className="text-xs text-slate-500">{slot.endTime}</div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Message */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <CardTitle>Additional Notes</CardTitle>
              </div>
              <CardDescription>
                Anything you'd like us to know? (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Tell us about your needs, questions, or any special requirements..."
                value={bookingData.message}
                onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                className="min-h-[150px] text-base"
              />
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Booking</CardTitle>
              <CardDescription>
                Please confirm your details before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <User className="w-5 h-5 text-slate-600 mt-0.5" />
                  <div>
                    <div className="font-medium">{bookingData.name}</div>
                    <div className="text-sm text-slate-600">{bookingData.email}</div>
                    {bookingData.phone && (
                      <div className="text-sm text-slate-600">{bookingData.phone}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-slate-600 mt-0.5" />
                  <div>
                    <div className="font-medium">
                      {bookingData.date && format(bookingData.date, 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="text-sm text-slate-600">
                      {bookingData.timeSlot?.startTime} - {bookingData.timeSlot?.endTime}
                    </div>
                  </div>
                </div>

                {bookingData.message && (
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-slate-600 mt-0.5" />
                    <div className="text-sm text-slate-700">{bookingData.message}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Success */}
        {step === 6 && (
          <Card>
            <CardContent className="pt-6 pb-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Submitted!</h2>
              <p className="text-slate-600 mb-6">
                We've received your booking request. You'll receive a confirmation email once it's approved.
              </p>
              <Button
                onClick={() => navigate('/book')}
                className="w-full h-12"
              >
                Book Another Meeting
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Bottom Button */}
      {step < 6 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button
            onClick={step === 5 ? handleSubmit : handleNext}
            disabled={
              (step === 1 && !isStep1Valid) ||
              (step === 2 && !isStep2Valid) ||
              (step === 3 && !isStep3Valid) ||
              createBooking.isPending
            }
            className="w-full h-12 text-base"
          >
            {step === 5 ? (createBooking.isPending ? 'Submitting...' : 'Submit Booking') : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}
