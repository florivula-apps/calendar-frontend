import { Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from '@/layouts/MobileLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import BookMeeting from '@/pages/BookMeeting';
import Bookings from '@/pages/Bookings';
import Availability from '@/pages/Availability';
import Profile from '@/pages/Profile';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/book" element={<BookMeeting />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes with mobile layout */}
      <Route
        element={
          <ProtectedRoute>
            <MobileLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Bookings />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Redirect all other routes to public booking page */}
      <Route path="*" element={<Navigate to="/book" replace />} />
    </Routes>
  );
}

export default App;
