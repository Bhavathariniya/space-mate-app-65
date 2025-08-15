import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { testWarderLogin, checkWarderNavigation } from '@/utils/testWarderLogin';

const WardenTest = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runWardenTests = async () => {
    setIsRunning(true);
    setTestResults({});

    try {
      // Test 1: Check existing warden users
      console.log('🔍 Testing existing warden users...');
      const { data: existingWarders, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, admin_sub_role, pg_property_id')
        .eq('role', 'warden');

      if (fetchError) {
        setTestResults(prev => ({
          ...prev,
          existingWarders: { success: false, error: fetchError.message }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          existingWarders: { 
            success: true, 
            count: existingWarders?.length || 0,
            users: existingWarders 
          }
        }));
      }

      // Test 2: Check PG properties for warden linking
      console.log('🔍 Testing PG properties availability...');
      const { data: pgProperties, error: pgError } = await supabase
        .from('pg_properties')
        .select('id, name, address, city')
        .eq('is_active', true)
        .limit(5);

      if (pgError) {
        setTestResults(prev => ({
          ...prev,
          pgProperties: { success: false, error: pgError.message }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          pgProperties: { 
            success: true, 
            count: pgProperties?.length || 0,
            properties: pgProperties 
          }
        }));
      }

      // Test 3: Check database trigger functionality
      console.log('🔍 Testing database trigger setup...');
      const { data: triggerData, error: triggerError } = await supabase
        .rpc('get_user_primary_role');

      if (triggerError) {
        setTestResults(prev => ({
          ...prev,
          databaseTrigger: { success: false, error: triggerError.message }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          databaseTrigger: { success: true, data: triggerData }
        }));
      }

      // Test 4: Run the test utility functions
      console.log('🔍 Running test utility functions...');
      await testWarderLogin();
      checkWarderNavigation();

      setTestResults(prev => ({
        ...prev,
        testUtilities: { success: true, message: 'Test utilities executed successfully' }
      }));

      toast({
        title: "Tests Completed",
        description: "Warden functionality tests have been completed. Check console for detailed results.",
      });

    } catch (error) {
      console.error('❌ Error running warden tests:', error);
      setTestResults(prev => ({
        ...prev,
        general: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const testWardenLogin = async () => {
    try {
      // Test with existing warden credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'warden@test.com',
        password: 'password123'
      });

      if (error) {
        toast({
          title: "Login Test Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Test Successful",
          description: "Warden login is working correctly",
        });
      }
    } catch (error) {
      toast({
        title: "Login Test Error",
        description: "An error occurred during login test",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              🧪 Warden Functionality Test Suite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={runWardenTests}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRunning ? "Running Tests..." : "Run All Tests"}
              </Button>
              <Button 
                onClick={testWardenLogin}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Test Warden Login
              </Button>
            </div>

            <div className="text-sm text-gray-600 text-center">
              This page tests the warden signup, login, and navigation functionality.
              Check the browser console for detailed test results.
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(testResults).map(([testName, result]: [string, any]) => (
                  <div key={testName} className="border rounded-lg p-4">
                    <h3 className="font-semibold capitalize mb-2">
                      {testName.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    {result.success ? (
                      <div className="text-green-600">
                        ✅ {result.message || `Test passed`}
                        {result.count !== undefined && ` (Count: ${result.count})`}
                        {result.users && (
                          <div className="mt-2 text-sm">
                            <strong>Users:</strong>
                            <ul className="list-disc list-inside ml-4">
                              {result.users.map((user: any) => (
                                <li key={user.id}>
                                  {user.email} - {user.full_name} - PG Property: {user.pg_property_id || 'None'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {result.properties && (
                          <div className="mt-2 text-sm">
                            <strong>Properties:</strong>
                            <ul className="list-disc list-inside ml-4">
                              {result.properties.map((prop: any) => (
                                <li key={prop.id}>
                                  {prop.name} - {prop.address}, {prop.city}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-red-600">
                        ❌ {result.error || 'Test failed'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test Warden Functionality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Manual Signup Test:</h4>
              <ol className="list-decimal list-inside ml-4 space-y-1 text-sm">
                <li>Go to <code className="bg-gray-100 px-1 rounded">/login</code></li>
                <li>Click "Sign Up" tab</li>
                <li>Select "Admin" role</li>
                <li>Choose "Warden" sub-role</li>
                <li>Fill out the warden signup form</li>
                <li>Select a PG property and submit</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">2. Manual Login Test:</h4>
              <ol className="list-decimal list-inside ml-4 space-y-1 text-sm">
                <li>Use existing credentials: <code className="bg-gray-100 px-1 rounded">warden@test.com</code> / <code className="bg-gray-100 px-1 rounded">password123</code></li>
                <li>Login should redirect to <code className="bg-gray-100 px-1 rounded">/warden</code></li>
                <li>Verify warden dashboard loads correctly</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">3. Expected Behavior:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>Warden signup should create user with role: 'warden'</li>
                <li>Profile should be linked to selected PG property</li>
                <li>Login should redirect to warden dashboard</li>
                <li>Navigation should work for all warden routes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WardenTest;
