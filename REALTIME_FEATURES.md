# Real-Time Dashboard Features & Guest Signup Improvements

## 🚀 Real-Time Dashboard Implementation

### Overview
The Space Mate application now features comprehensive real-time dashboard updates using Supabase's real-time subscriptions. This provides live updates for admins and guests without requiring page refreshes.

### Key Features Implemented

#### 1. Real-Time Data Hooks (`src/hooks/useRealTimeData.ts`)
- **useRealTimePGProperties()**: Live updates for PG property data
- **useRealTimeRooms()**: Real-time room availability and status changes
- **useRealTimePayments()**: Live payment tracking and updates
- **useRealTimeNotifications()**: Instant notification delivery
- **useRealTimeMaintenance()**: Live maintenance request updates
- **useRealTimeMeals()**: Real-time meal schedule updates

#### 2. Real-Time Dashboard Component (`src/components/RealTimeDashboard.tsx`)
- Live statistics with auto-refresh
- Real-time activity feeds
- Connection status indicators
- Animated progress bars
- Live update timestamps

#### 3. Supabase Real-Time Subscriptions
- PostgreSQL change notifications
- Automatic data invalidation and refetch
- Toast notifications for important events
- Optimized subscription management

### Real-Time Features

#### For Admins:
- **Live Occupancy Tracking**: Real-time room availability updates
- **Instant Payment Notifications**: Immediate alerts for new payments
- **Live Maintenance Requests**: Real-time service request updates
- **Dynamic Statistics**: Auto-updating metrics and analytics
- **Live Activity Feed**: Real-time activity monitoring

#### For Guests:
- **Live Payment Status**: Real-time payment confirmation
- **Instant Notifications**: Immediate delivery of important updates
- **Live Meal Updates**: Real-time meal schedule changes
- **Room Status Updates**: Live room availability changes

### Technical Implementation

#### Real-Time Hooks Structure:
```typescript
export const useRealTimePGProperties = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['pg-properties-realtime'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pg_properties')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  useEffect(() => {
    const subscription = supabase
      .channel('pg_properties_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pg_properties',
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['pg-properties-realtime'] });
        
        if (payload.eventType === 'INSERT') {
          toast({
            title: "New PG Property Added",
            description: `Property "${payload.new.name}" has been added.`,
          });
        }
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [queryClient, toast]);

  return { properties, isLoading, error };
};
```

## 🏠 Guest Signup Improvements

### Enhanced Guest Registration Process

#### 1. New Guest Signup Form (`src/components/GuestSignupForm.tsx`)
- **5-Step Registration Process**:
  1. Personal Information
  2. PG Property Selection (Dropdown from database)
  3. Room Selection (Dynamic based on property)
  4. Guest Details
  5. Terms & Conditions

#### 2. Database Integration
- **Real PG Property Selection**: Dropdown populated from `pg_properties` table
- **Dynamic Room Selection**: Available rooms filtered by selected property
- **Automatic Room Assignment**: Creates `room_assignments` record
- **Profile Updates**: Links guest to selected PG property

#### 3. Key Features

##### PG Property Selection:
```typescript
// Fetch PG Properties from database
const { data: propertiesData, error: propertiesError } = await supabase
  .from('pg_properties')
  .select('*')
  .eq('is_active', true);

// Dynamic dropdown with property details
<Select value={formData.pgPropertyId} onValueChange={(value) => handleSelectChange("pgPropertyId", value)}>
  <SelectContent>
    {pgProperties.map((property) => (
      <SelectItem key={property.id} value={property.id}>
        <div className="flex flex-col">
          <span className="font-medium">{property.name}</span>
          <span className="text-xs text-gray-500">
            {property.city}, {property.state} - ₹{property.monthly_rent}/month
          </span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

##### Room Selection:
```typescript
// Fetch available rooms for selected property
const { data: roomsData, error: roomsError } = await supabase
  .from('rooms')
  .select('*')
  .eq('pg_property_id', selectedProperty)
  .eq('is_available', true);

// Dynamic room dropdown
<Select value={formData.roomId} onValueChange={(value) => handleSelectChange("roomId", value)}>
  <SelectContent>
    {rooms.map((room) => (
      <SelectItem key={room.id} value={room.id}>
        <div className="flex flex-col">
          <span className="font-medium">Room {room.room_number}</span>
          <span className="text-xs text-gray-500">
            {room.type} - ₹{room.price}/month - Capacity: {room.capacity}
          </span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### 4. Database Operations on Signup

##### User Account Creation:
```typescript
const { error: signupError } = await signUp(guestFormData.emailAddress, guestFormData.password, {
  full_name: guestFormData.fullName,
  role: 'guest',
  admin_sub_role: undefined,
});
```

##### Profile Update:
```typescript
const { error: profileError } = await supabase
  .from('profiles')
  .update({
    phone: guestFormData.mobile,
    pg_property_id: guestFormData.pgPropertyId,
  })
  .eq('id', user.id);
```

##### Room Assignment:
```typescript
const { error: roomAssignmentError } = await supabase
  .from('room_assignments')
  .insert({
    user_id: user.id,
    pg_property_id: guestFormData.pgPropertyId,
    room_id: guestFormData.roomId,
    start_date: guestFormData.joinDate,
    end_date: guestFormData.endDate,
    monthly_rent: 0,
    security_deposit: 0,
    is_active: true,
  });
```

##### Room Availability Update:
```typescript
const { error: roomUpdateError } = await supabase
  .from('rooms')
  .update({
    is_available: false,
    occupied: 1,
  })
  .eq('id', guestFormData.roomId);
```

## 🧪 Testing Real-Time Features

### Test Utilities (`src/utils/testRealTimeData.ts`)

#### Setup Test Environment:
```typescript
import { setupTestEnvironment } from '@/utils/testRealTimeData';

// Setup complete test environment
await setupTestEnvironment();
```

#### Add Test Data:
```typescript
import { addTestData } from '@/utils/testRealTimeData';

// Add sample notifications, payments, and room updates
await addTestData();
```

#### Simulate Real-Time Updates:
```typescript
import { simulateRealTimeUpdates } from '@/utils/testRealTimeData';

// Start automatic test data generation
const stopSimulation = simulateRealTimeUpdates();

// Stop simulation
stopSimulation();
```

### Demo Route
Access the real-time dashboard demo at: `/realtime-demo`

## 📊 Real-Time Dashboard Features

### Live Statistics
- **PG Properties Count**: Real-time property updates
- **Room Occupancy**: Live availability tracking
- **Revenue Tracking**: Instant payment updates
- **Notification Count**: Live notification delivery

### Real-Time Activity Feeds
- **Recent Payments**: Live payment transactions
- **Recent Notifications**: Instant notification delivery
- **Connection Status**: Real-time subscription monitoring

### Visual Indicators
- **Live Status Badge**: Animated "Live" indicator
- **Update Timestamps**: Last refresh time display
- **Progress Bars**: Real-time metric visualization
- **Status Colors**: Color-coded status indicators

## 🔧 Configuration

### Supabase Real-Time Setup
1. Enable real-time in Supabase dashboard
2. Configure Row Level Security (RLS) policies
3. Set up database triggers for notifications

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Usage Instructions

### For Developers:
1. Import real-time hooks in components
2. Use the hooks to get live data
3. Components automatically update when data changes
4. Toast notifications appear for important events

### For Users:
1. **Admins**: Dashboard automatically updates with live data
2. **Guests**: Real-time notifications and payment updates
3. **All Users**: No manual refresh required

## 📈 Performance Optimizations

### Query Optimization:
- **Stale Time**: 5-10 seconds for most queries
- **Refetch Intervals**: Optimized based on data type
- **Selective Updates**: Only relevant data is refetched

### Subscription Management:
- **Automatic Cleanup**: Subscriptions unsubscribe on component unmount
- **Channel Optimization**: Single channel per table type
- **Error Handling**: Graceful fallback for connection issues

## 🔮 Future Enhancements

### Planned Features:
1. **WebSocket Fallback**: Alternative to Supabase real-time
2. **Offline Support**: Queue updates when offline
3. **Push Notifications**: Mobile push notifications
4. **Advanced Analytics**: Real-time charts and graphs
5. **Multi-Property Support**: Real-time updates across multiple properties

### Performance Improvements:
1. **Data Caching**: Redis integration for faster access
2. **Query Optimization**: Database indexing improvements
3. **Bundle Optimization**: Code splitting for real-time features
4. **Memory Management**: Better subscription cleanup

## 🐛 Troubleshooting

### Common Issues:
1. **Real-time not working**: Check Supabase real-time settings
2. **Data not updating**: Verify RLS policies
3. **Performance issues**: Check query optimization
4. **Connection errors**: Verify network connectivity

### Debug Tools:
1. **Browser Console**: Real-time event logging
2. **Supabase Dashboard**: Real-time monitoring
3. **Network Tab**: Subscription status
4. **Test Utilities**: Manual data generation

## 📝 API Reference

### Real-Time Hooks:
- `useRealTimePGProperties()`: PG property updates
- `useRealTimeRooms(propertyId?)`: Room availability
- `useRealTimePayments(userId?)`: Payment tracking
- `useRealTimeNotifications(userId?)`: Notification delivery
- `useRealTimeMaintenance(propertyId?)`: Maintenance requests
- `useRealTimeMeals(propertyId?)`: Meal schedule updates

### Guest Signup Components:
- `GuestSignupForm`: Complete registration form
- `PGPropertySelector`: Property selection dropdown
- `RoomSelector`: Room selection component

This implementation provides a robust, scalable real-time system that enhances user experience and provides immediate feedback for all critical operations in the Space Mate application. 