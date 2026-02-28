import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  Info,
  Moon,
} from 'lucide-react';
import { getInitials, formatDate } from '@/lib/utils';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

function SettingItem({ icon, label, value, onClick }: SettingItemProps) {
  return (
    <button
      className="flex w-full items-center gap-3 px-4 py-3 touch-target active:bg-accent transition-colors"
      onClick={onClick}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      {value && (
        <span className="text-sm text-muted-foreground">{value}</span>
      )}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-4 p-4">
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

      {/* Account Settings */}
      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-3">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Account
            </h3>
          </div>
          <SettingItem
            icon={<User className="h-5 w-5" />}
            label="Edit Profile"
          />
          <Separator className="ml-12" />
          <SettingItem
            icon={<Mail className="h-5 w-5" />}
            label="Email"
            value={user?.email}
          />
          <Separator className="ml-12" />
          <SettingItem
            icon={<Shield className="h-5 w-5" />}
            label="Change Password"
          />
          <Separator className="ml-12" />
          <SettingItem
            icon={<Calendar className="h-5 w-5" />}
            label="Joined"
            value={user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
          />
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-3">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Preferences
            </h3>
          </div>
          <SettingItem
            icon={<Bell className="h-5 w-5" />}
            label="Notifications"
          />
          <Separator className="ml-12" />
          <SettingItem
            icon={<Moon className="h-5 w-5" />}
            label="Appearance"
            value="System"
          />
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-3">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Support
            </h3>
          </div>
          <SettingItem
            icon={<HelpCircle className="h-5 w-5" />}
            label="Help & FAQ"
          />
          <Separator className="ml-12" />
          <SettingItem
            icon={<Info className="h-5 w-5" />}
            label="About"
            value="v1.0.0"
          />
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

      {/* Bottom spacing */}
      <div className="h-4" />
    </div>
  );
}
