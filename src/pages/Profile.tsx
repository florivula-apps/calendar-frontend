import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Clock,
  Timer,
} from 'lucide-react';
import { getInitials, formatDate } from '@/lib/utils';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [defaultDuration, setDefaultDuration] = useState(30);
  const [bookingBuffer, setBookingBuffer] = useState(15);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your account settings
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(user?.name || 'User')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">
                {user?.name || 'User'}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email || 'user@example.com'}
              </p>
              {user?.createdAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {formatDate(user.createdAt)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking Settings</CardTitle>
            <CardDescription>
              Configure your default meeting preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Default Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <Label className="text-base">Default Duration</Label>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {defaultDuration} min
                </span>
              </div>
              <Slider
                value={[defaultDuration]}
                onValueChange={(value) => setDefaultDuration(value[0])}
                min={15}
                max={120}
                step={15}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                How long should meetings be by default?
              </p>
            </div>

            <Separator />

            {/* Booking Buffer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-slate-500" />
                  <Label className="text-base">Booking Buffer</Label>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {bookingBuffer} min
                </span>
              </div>
              <Slider
                value={[bookingBuffer]}
                onValueChange={(value) => setBookingBuffer(value[0])}
                min={0}
                max={60}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Time buffer between consecutive meetings
              </p>
            </div>

            <Button className="w-full h-10">
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <User className="w-5 h-5 text-slate-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Name</p>
                <p className="font-medium truncate">{user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Mail className="w-5 h-5 text-slate-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium truncate">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Member Since</p>
                <p className="font-medium">
                  {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 text-base text-destructive border-destructive/30"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign Out
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Sign Out</DrawerTitle>
              <DrawerDescription>
                Are you sure you want to sign out of your account?
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button
                variant="destructive"
                className="h-12 text-base"
                onClick={handleLogout}
              >
                Yes, sign out
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="h-12 text-base">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
