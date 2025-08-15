import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Users, Star, Wifi, Car, UtensilsCrossed, Search, Bed } from 'lucide-react';

interface PGProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  description: string;
  amenities: string[];
  monthly_rent: number;
  total_rooms: number;
  occupied_rooms: number;
  rating: number;
  images: string[];
}

interface Room {
  id: string;
  room_number: string;
  type: string;
  capacity: number;
  occupied: number;
  price: number;
  amenities: string[];
  is_available: boolean;
}

export default function ConnectedPublicDashboard() {
  const [properties, setProperties] = useState<PGProperty[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from Supabase...');
        
        // Fetch PG properties - using any type to bypass TypeScript issues
        const { data: propertiesData, error: propertiesError } = await (supabase as any)
          .from('pg_properties')
          .select('*')
          .eq('is_active', true);

        if (propertiesError) {
          console.error('Properties error:', propertiesError);
          throw propertiesError;
        }

        // Fetch available rooms
        const { data: roomsData, error: roomsError } = await (supabase as any)
          .from('rooms')
          .select('*')
          .eq('is_available', true);

        if (roomsError) {
          console.error('Rooms error:', roomsError);
          throw roomsError;
        }

        console.log('Properties:', propertiesData);
        console.log('Rooms:', roomsData);

        setProperties(propertiesData || []);
        setRooms(roomsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRooms = searchQuery
    ? rooms.filter(room => 
        room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.room_number.includes(searchQuery)
      )
    : rooms;

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (lowerAmenity.includes('parking') || lowerAmenity.includes('car')) return <Car className="h-4 w-4" />;
    if (lowerAmenity.includes('mess') || lowerAmenity.includes('kitchen')) return <UtensilsCrossed className="h-4 w-4" />;
    return <Bed className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading properties from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Error connecting to database: {error}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Make sure your database is properly set up and contains sample data.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">SpaceMate - Connected to Database!</h1>
        <p className="text-muted-foreground mb-6">
          Real-time data from Supabase database showing {properties.length} properties and {rooms.length} available rooms
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search rooms by type or number..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Available Properties</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{property.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{property.rating || 4.5}</span>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {property.city}, {property.state}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {property.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {property.total_rooms - property.occupied_rooms} of {property.total_rooms} rooms available
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {property.amenities?.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </Badge>
                    ))}
                    {property.amenities?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{property.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ₹{Number(property.monthly_rent).toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Rooms Section */}
      {filteredRooms.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Available Rooms {searchQuery && `(${filteredRooms.length} found)`}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Room {room.room_number}</CardTitle>
                  <CardDescription className="capitalize">{room.type} occupancy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capacity:</span>
                      <span>{room.capacity} person{room.capacity > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Occupied:</span>
                      <span>{room.occupied}/{room.capacity}</span>
                    </div>
                    
                    {room.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {room.amenities.slice(0, 2).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.amenities.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{Number(room.price).toLocaleString()}
                      </span>
                      <Badge variant={room.is_available ? "default" : "secondary"}>
                        {room.is_available ? "Available" : "Occupied"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {properties.length === 0 && rooms.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-muted rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Database Connected Successfully!</h3>
            <p className="text-muted-foreground mb-4">
              No properties or rooms found in the database yet.
            </p>
            <p className="text-sm text-muted-foreground">
              The sample data should have been inserted. Check the database or try refreshing.
            </p>
          </div>
        </div>
      )}

      {/* Search No Results */}
      {searchQuery && filteredRooms.length === 0 && rooms.length > 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No rooms found matching "{searchQuery}"</p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}