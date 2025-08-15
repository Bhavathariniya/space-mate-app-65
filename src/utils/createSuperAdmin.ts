import { supabase } from '@/integrations/supabase/client';

export const createSuperAdmin = async () => {
  try {
    // Create super admin user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@spacemate.com',
      password: 'admin123456',
      options: {
        data: {
          full_name: 'Super Admin',
          role: 'super_admin',
          admin_sub_role: 'super_admin',
        }
      }
    });

    if (authError) {
      console.error('Error creating super admin auth user:', authError);
      return { error: authError };
    }

    if (authData.user) {
      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: 'admin@spacemate.com',
          full_name: 'Super Admin',
          role: 'super_admin',
          admin_sub_role: 'super_admin',
          phone: '+91-9876543210',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        });

      if (profileError) {
        console.error('Error creating super admin profile:', profileError);
        return { error: profileError };
      }

      console.log('Super admin created successfully');
      return { success: true, user: authData.user };
    }

    return { error: new Error('Failed to create super admin user') };
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { error };
  }
};

export const createTestUsers = async () => {
  const users = [
    {
      email: 'superadmin@test.com',
      password: 'password123',
      full_name: 'Super Admin Test',
      role: 'super_admin',
      admin_sub_role: 'super_admin',
      phone: '+91-9876543210',
    },
    {
      email: 'pgadmin@test.com',
      password: 'password123',
      full_name: 'PG Admin Test',
      role: 'pg_admin',
      admin_sub_role: 'pg_admin',
      phone: '+91-9876543211',
    },
    {
      email: 'warden@test.com',
      password: 'password123',
      full_name: 'Warden Test',
      role: 'warden',
      admin_sub_role: 'warden',
      phone: '+91-9876543212',
    },
    {
      email: 'guest@test.com',
      password: 'password123',
      full_name: 'Guest Test',
      role: 'guest',
      phone: '+91-9876543213',
    },
  ];

  const results = [];

  for (const userData of users) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            admin_sub_role: userData.admin_sub_role,
          }
        }
      });

      if (authError) {
        console.error(`Error creating ${userData.email}:`, authError);
        results.push({ email: userData.email, error: authError });
        continue;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: userData.email,
            full_name: userData.full_name,
            role: userData.role,
            admin_sub_role: userData.admin_sub_role,
            phone: userData.phone,
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          });

        if (profileError) {
          console.error(`Error creating profile for ${userData.email}:`, profileError);
          results.push({ email: userData.email, error: profileError });
        } else {
          console.log(`User ${userData.email} created successfully`);
          results.push({ email: userData.email, success: true });
        }
      }
    } catch (error) {
      console.error(`Error creating ${userData.email}:`, error);
      results.push({ email: userData.email, error });
    }
  }

  return results;
};

export const checkExistingUsers = async () => {
  try {
    // Check profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email, role, admin_sub_role')
      .in('role', ['super_admin', 'pg_admin', 'warden']);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return { error: profilesError };
    }

    console.log('Existing admin users:', profiles);
    return { profiles };
  } catch (error) {
    console.error('Error checking existing users:', error);
    return { error };
  }
}; 