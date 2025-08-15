import { supabase } from '@/integrations/supabase/client';

export const setupSingleSuperAdmin = async (email?: string, password?: string) => {
  try {
    console.log('🔧 Setting up single super admin...');

    // Use provided credentials or defaults
    const finalEmail = email || 'superadmin@spacemate.com';
    const finalPassword = password || 'SuperAdmin2024!';

    console.log('📧 Using email:', finalEmail);

    // First, check if super admin already exists
    const { data: existingSuperAdmin, error: checkError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('role', 'super_admin')
      .single();

    if (existingSuperAdmin) {
      console.log('✅ Super admin already exists:', existingSuperAdmin.email);
      return { 
        success: true, 
        message: 'Super admin already exists',
        user: existingSuperAdmin,
        credentials: {
          email: finalEmail,
          password: finalPassword
        }
      };
    }

    // Create super admin user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: finalEmail,
      password: finalPassword,
      options: {
        data: {
          full_name: 'Super Administrator',
          role: 'super_admin',
          admin_sub_role: 'super_admin',
        }
      }
    });

    if (authError) {
      console.error('❌ Error creating super admin auth user:', authError);
      return { error: authError };
    }

    if (authData.user) {
      console.log('✅ Super admin auth user created successfully');

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify the profile was created
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        return { error: profileError };
      }

      console.log('✅ Super admin profile created successfully');
      console.log('📧 Email:', profile.email);
      console.log('👤 Name:', profile.full_name);
      console.log('🔑 Role:', profile.role);

      return { 
        success: true, 
        message: 'Super admin created successfully',
        user: profile,
        credentials: {
          email: finalEmail,
          password: finalPassword
        }
      };
    }

    return { error: new Error('Failed to create super admin user') };

  } catch (error) {
    console.error('❌ Error setting up super admin:', error);
    return { error };
  }
};

export const getSuperAdminCredentials = () => {
  return {
    email: 'superadmin@spacemate.com',
    password: 'SuperAdmin2024!'
  };
};

export const checkSuperAdminStatus = async () => {
  try {
    const { data: superAdmins, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .eq('role', 'super_admin');

    if (error) {
      return { error };
    }

    return {
      count: superAdmins?.length || 0,
      users: superAdmins || [],
      hasSingleSuperAdmin: superAdmins?.length === 1
    };
  } catch (error) {
    return { error };
  }
};

// Run setup if called directly
if (typeof window !== 'undefined') {
  (window as any).setupSingleSuperAdmin = setupSingleSuperAdmin;
  (window as any).getSuperAdminCredentials = getSuperAdminCredentials;
  (window as any).checkSuperAdminStatus = checkSuperAdminStatus;

  console.log('🔧 Super admin utilities available on window:');
  console.log('  - setupSingleSuperAdmin()');
  console.log('  - getSuperAdminCredentials()');
  console.log('  - checkSuperAdminStatus()');
}
