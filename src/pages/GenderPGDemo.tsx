import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGenderBasedPGs } from '@/hooks/useGenderBasedPGs';

const GenderPGDemo: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedPreference, setSelectedPreference] = useState<string>('');
  
  const { pgProperties, loading, error } = useGenderBasedPGs(
    selectedGender || null,
    selectedPreference || null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Gender-Based PG Selection Demo</CardTitle>
            <p className="text-blue-100">
              Test the new gender-based PG filtering system
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <Label htmlFor="gender">Select Gender</Label>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Choose your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="preference">Select PG Preference</Label>
                <Select value={selectedPreference} onValueChange={setSelectedPreference}>
                  <SelectTrigger id="preference">
                    <SelectValue placeholder="Choose PG type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="co-living">Co-living (Mixed Gender)</SelectItem>
                    <SelectItem value="men-only">Men Only</SelectItem>
                    <SelectItem value="women-only">Women Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Co-living:</strong> Shows all unisex PGs where both genders can stay</li>
                <li><strong>Men Only:</strong> Shows male-specific PGs + co-living PGs</li>
                <li><strong>Women Only:</strong> Shows female-specific PGs + co-living PGs</li>
              </ul>
            </div>

            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg">Loading available PGs...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 p-4 rounded-lg mb-6">
                <p className="text-red-800">Error: {error}</p>
              </div>
            )}

            {!loading && !error && selectedGender && selectedPreference && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Available PGs for {selectedGender} ({selectedPreference}): {pgProperties.length} found
                </h3>
                
                {pgProperties.length === 0 ? (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800">
                      No PGs available for your selected preferences. Try a different combination.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pgProperties.map((pg) => (
                      <Card key={pg.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-lg mb-2">{pg.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{pg.address}</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>City:</span>
                              <span className="font-medium">{pg.city}, {pg.state}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Monthly Rent:</span>
                              <span className="font-medium">₹{pg.monthly_rent}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Available Rooms:</span>
                              <span className="font-medium">{pg.total_rooms - pg.occupied_rooms}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rating:</span>
                              <span className="font-medium">{pg.rating}/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <span className="font-medium text-blue-600">{pg.pg_type}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!selectedGender || !selectedPreference ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600">
                  Please select both gender and PG preference to see available options
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenderPGDemo;

