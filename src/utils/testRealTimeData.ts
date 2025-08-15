import { supabase } from '@/integrations/supabase/client';

// Test function to add sample data for real-time testing
export const addTestData = async () => {
  try {
    // Add a test notification
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        title: 'Test Notification',
        message: 'This is a test notification for real-time updates',
        type: 'test',
        user_id: null, // Global notification
        pg_property_id: null,
        is_read: false,
        requires_action: false,
      });

    if (notificationError) {
      console.error('Error adding test notification:', notificationError);
    } else {
      console.log('Test notification added successfully');
    }

    // Add a test payment
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: '11111111-1111-1111-1111-111111111111', // Use existing user ID
        pg_property_id: '12345678-1234-5678-9012-123456789012', // Use existing property ID
        type: 'test',
        amount: Math.floor(Math.random() * 5000) + 1000, // Random amount between 1000-6000
        status: 'completed',
        description: 'Test payment for real-time updates',
        currency: 'INR',
        payment_method: 'test',
        transaction_id: `TXN-${Date.now()}`,
      });

    if (paymentError) {
      console.error('Error adding test payment:', paymentError);
    } else {
      console.log('Test payment added successfully');
    }

    // Update a room status
    const { error: roomError } = await supabase
      .from('rooms')
      .update({
        is_available: Math.random() > 0.5, // Randomly toggle availability
        updated_at: new Date().toISOString(),
      })
      .eq('id', '11111111-1111-1111-1111-111111111111') // Use existing room ID
      .limit(1);

    if (roomError) {
      console.error('Error updating test room:', roomError);
    } else {
      console.log('Test room updated successfully');
    }

  } catch (error) {
    console.error('Error adding test data:', error);
  }
};

// Function to simulate real-time updates
export const simulateRealTimeUpdates = () => {
  const interval = setInterval(async () => {
    await addTestData();
  }, 10000); // Add test data every 10 seconds

  return () => clearInterval(interval);
};

// Function to test real-time subscriptions
export const testRealTimeSubscriptions = () => {
  // Test notifications subscription
  const notificationsSubscription = supabase
    .channel('test_notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      },
      (payload) => {
        console.log('Real-time notification received:', payload);
      }
    )
    .subscribe();

  // Test payments subscription
  const paymentsSubscription = supabase
    .channel('test_payments')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'payments',
      },
      (payload) => {
        console.log('Real-time payment received:', payload);
      }
    )
    .subscribe();

  // Test rooms subscription
  const roomsSubscription = supabase
    .channel('test_rooms')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
      },
      (payload) => {
        console.log('Real-time room update received:', payload);
      }
    )
    .subscribe();

  return () => {
    notificationsSubscription.unsubscribe();
    paymentsSubscription.unsubscribe();
    roomsSubscription.unsubscribe();
  };
};

// Function to add sample PG property for testing
export const addSamplePGProperty = async () => {
  try {
    const { error } = await supabase
      .from('pg_properties')
      .insert({
        name: 'Test PG Property',
        address: '123 Test Street, Test City',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        contact_number: '+91-9876543210',
        manager_name: 'Test Manager',
        total_rooms: 10,
        occupied_rooms: 5,
        monthly_rent: 8000,
        security_deposit: 15000,
        description: 'A test PG property for real-time testing',
        amenities: ['WiFi', 'AC', 'Food'],
        rating: 4.5,
        is_active: true,
      });

    if (error) {
      console.error('Error adding sample PG property:', error);
    } else {
      console.log('Sample PG property added successfully');
    }
  } catch (error) {
    console.error('Error adding sample PG property:', error);
  }
};

// Function to add sample rooms for testing
export const addSampleRooms = async (pgPropertyId: string) => {
  try {
    const rooms = [
      {
        pg_property_id: pgPropertyId,
        room_number: '101',
        type: 'single',
        capacity: 1,
        price: 8000,
        is_available: true,
        amenities: ['AC', 'Attached Bathroom'],
      },
      {
        pg_property_id: pgPropertyId,
        room_number: '102',
        type: 'double',
        capacity: 2,
        price: 6000,
        is_available: true,
        amenities: ['Fan', 'Common Bathroom'],
      },
      {
        pg_property_id: pgPropertyId,
        room_number: '103',
        type: 'triple',
        capacity: 3,
        price: 5000,
        is_available: false,
        amenities: ['Fan', 'Common Bathroom'],
      },
    ];

    const { error } = await supabase
      .from('rooms')
      .insert(rooms);

    if (error) {
      console.error('Error adding sample rooms:', error);
    } else {
      console.log('Sample rooms added successfully');
    }
  } catch (error) {
    console.error('Error adding sample rooms:', error);
  }
};

// Function to setup complete test environment
export const setupTestEnvironment = async () => {
  console.log('Setting up test environment...');
  
  // Add sample PG property
  await addSamplePGProperty();
  
  // Get the newly created property ID and add rooms
  const { data: properties } = await supabase
    .from('pg_properties')
    .select('id')
    .eq('name', 'Test PG Property')
    .limit(1);

  if (properties && properties.length > 0) {
    await addSampleRooms(properties[0].id);
  }

  console.log('Test environment setup complete!');
};

// Export all functions for use in components
export default {
  addTestData,
  simulateRealTimeUpdates,
  testRealTimeSubscriptions,
  addSamplePGProperty,
  addSampleRooms,
  setupTestEnvironment,
}; 