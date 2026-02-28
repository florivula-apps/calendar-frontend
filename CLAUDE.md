# Calendar Mobile App - Meeting Scheduler UI

## Description
Mobile-first booking app with step-by-step public booking and admin calendar management.

## Requirements

### Two Different UIs

#### 1. PUBLIC VIEW (Not Logged In) - Single Page Scroll
Route: `/book` (default landing page, no auth required)

**Step-by-step booking flow:**
1. **Step 1:** Welcome + Name/Email/Phone form
2. **Step 2:** Calendar component to select date
3. **Step 3:** Available time slots for selected date (cards to tap)
4. **Step 4:** Message/notes textarea
5. **Step 5:** Review summary + Submit button
6. **Step 6:** Success confirmation

**UI Components:**
- Full-width cards for each step
- Large touch targets (min 44x44px)
- Progress indicator at top (1/6, 2/6, etc.)
- "Next" button at bottom (fixed position)
- Calendar widget (shadcn calendar component)
- Time slot cards (grid layout, 2 columns)

#### 2. ADMIN VIEW (Logged In) - Bottom Nav with Tabs
Routes: `/`, `/availability`, `/profile`

**Bottom Navigation (3 tabs):**
- 📅 Bookings (home)
- 🕐 Availability  
- 👤 Profile

**Bookings Tab (`/`):**
- Pending requests section (cards with Approve/Reject buttons)
- Upcoming meetings section (today + next 7 days)
- Past meetings section (collapsible)
- Pull-to-refresh
- Each booking card shows: name, email, date/time, message

**Availability Tab (`/availability`):**
- Form to create time slot (date picker + start/end time)
- List of created slots (cards with delete button)
- Floating action button (+) to add new slot

**Profile Tab (`/profile`):**
- User info display
- Default duration setting (slider: 15-120 min)
- Booking buffer setting (slider: 0-60 min)
- Logout button

### API Hooks

Add to `src/hooks/useCalendar.ts`:

```typescript
// Public
export function useAvailability(date: string) {
  return useQuery({
    queryKey: ['availability', date],
    queryFn: () => api.get(`/calendar/availability?date=${date}`).then(r => r.data),
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: (data) => api.post('/calendar/book', data).then(r => r.data),
  });
}

// Admin (protected)
export function useBookings(status?: string) {
  return useQuery({
    queryKey: ['bookings', status],
    queryFn: () => api.get(`/calendar/bookings${status ? `?status=${status}` : ''}`).then(r => r.data),
  });
}

export function useApproveBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.put(`/calendar/bookings/${id}/approve`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.put(`/calendar/bookings/${id}/reject`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useTimeSlots() {
  return useQuery({
    queryKey: ['timeSlots'],
    queryFn: () => api.get('/calendar/slots').then(r => r.data),
  });
}

export function useCreateTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/calendar/slots', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timeSlots'] }),
  });
}

export function useDeleteTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/calendar/slots/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timeSlots'] }),
  });
}
```

### Routing

Update `src/App.tsx`:
```typescript
<Routes>
  <Route path="/book" element={<BookMeeting />} />
  <Route path="/login" element={<Login />} />
  
  {/* Admin routes */}
  <Route element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
    <Route path="/" element={<Bookings />} />
    <Route path="/availability" element={<Availability />} />
    <Route path="/profile" element={<Profile />} />
  </Route>
  
  <Route path="*" element={<Navigate to="/book" />} />
</Routes>
```

### BottomNav Configuration

Update `src/components/BottomNav.tsx`:
```typescript
const navItems = [
  { icon: Calendar, label: 'Bookings', path: '/' },
  { icon: Clock, label: 'Availability', path: '/availability' },
  { icon: User, label: 'Profile', path: '/profile' },
];
```

## Steps

1. Update `package.json` name to "calendar-frontend"
2. Update `index.html` title to "Calendar - Book a Meeting"
3. Create `src/hooks/useCalendar.ts` with API hooks
4. Create `src/pages/BookMeeting.tsx` (public multi-step booking)
5. Create `src/pages/Bookings.tsx` (admin bookings view)
6. Update `src/pages/Availability.tsx` (replace Items page)
7. Update `src/pages/Profile.tsx` (user settings)
8. Update `src/components/BottomNav.tsx` (3 tabs)
9. Update `src/App.tsx` routing
10. Fix auth response structure in `src/contexts/AuthContext.tsx`:
    - Change `data.tokens.accessToken` to `data.accessToken`
    - Change `data.tokens.refreshToken` to `data.refreshToken`
11. Update `src/types/index.ts`:
    - Change `AuthResponse` to have `accessToken` and `refreshToken` directly (not nested in `tokens`)
12. Test build: `npm run build`
13. Commit and push:
    ```bash
    git add -A
    git commit -m "Build mobile calendar UI with step-by-step booking"
    git push origin main
    ```

Then **exit immediately**. No waiting for review.

## Mobile UI Guidelines

- Touch targets min 44x44px
- Card-based layouts (no tables)
- Bottom nav always visible
- Pull-to-refresh on lists
- Single column layouts (no multi-column on mobile)
- Large, readable text (16px minimum)
- Generous padding/spacing
- Use shadcn/ui mobile components (Drawer, Sheet for modals)

Keep it clean, fast, and mobile-optimized. Exit when done.
