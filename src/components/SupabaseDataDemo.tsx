import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Star, Wifi, Car, Utensils, Shield, Clock, Wrench, CreditCard, ChefHat, Package } from 'lucide-react';
import { usePGProperties, useNotifications, useAllData } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';

const PropertyCard = ({ property }: { property: any }) => (
  <Card className="w-full">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-xl">{property.name}</CardTitle>
          <CardDescription className="flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" />
            {property.city}, {property.state}
          </CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{property.rating || 4.5}</span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{property.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{property.occupied_rooms}/{property.total_rooms} occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Est. {new Date(property.established).getFullYear()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {property.amenities?.slice(0, 4).map((amenity: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {amenity === 'WiFi' && <Wifi className="w-3 h-3 mr-1" />}
              {amenity === 'Parking' && <Car className="w-3 h-3 mr-1" />}
              {amenity === 'Kitchen' && <Utensils className="w-3 h-3 mr-1" />}
              {amenity === 'Security' && <Shield className="w-3 h-3 mr-1" />}
              {amenity}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4">
          <div>
            <span className="text-2xl font-bold">₹{property.monthly_rent?.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <Button>View Details</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const NotificationCard = ({ notification }: { notification: any }) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium">{notification.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {notification.type}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(notification.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const SupabaseDataDemo = () => {
  const { data: properties, isLoading: propertiesLoading, error: propertiesError } = usePGProperties();
  const { data: notifications, isLoading: notificationsLoading, error: notificationsError } = useNotifications();
  const { 
    data: allData, 
    isLoading: allDataLoading, 
    error: allDataError 
  } = useAllData();

  if (propertiesError || notificationsError || allDataError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading data from Supabase:</p>
              <p className="text-sm">{propertiesError?.message || notificationsError?.message || allDataError?.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">SpaceMate - Live Data from Supabase</h1>
        <p className="text-muted-foreground mt-2">
          Real-time data fetched from your Supabase database
        </p>
      </div>

      {/* PG Properties Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Available PG Properties</h2>
        {propertiesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties?.length ? (
              properties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No properties found in the database.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </section>

      {/* Notifications Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Notifications</h2>
        {notificationsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-4" />
                  <Skeleton className="h-3 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {notifications?.length ? (
              notifications.slice(0, 5).map((notification: any) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No notifications found in the database.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </section>

      {/* Database Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Database Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm">Connected to Supabase successfully</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Fetching data from: wepvpuuurwpbvjybdpfs.supabase.co
          </p>
        </CardContent>
      </Card>

      {/* All Database Tables Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Complete Database Overview</h2>
        {allDataLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Assets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Assets ({allData?.assets?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allData?.assets?.slice(0, 3).map((asset: any) => (
                    <div key={asset.id} className="flex justify-between items-center text-sm">
                      <span>{asset.name}</span>
                      <Badge variant="outline">{asset.quantity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payments ({allData?.payments?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allData?.payments?.slice(0, 3).map((payment: any) => (
                    <div key={payment.id} className="flex justify-between items-center text-sm">
                      <span>₹{payment.amount}</span>
                      <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Maintenance ({allData?.maintenance?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allData?.maintenance?.slice(0, 3).map((issue: any) => (
                    <div key={issue.id} className="text-sm">
                      <div className="font-medium">{issue.title}</div>
                      <Badge variant={issue.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                        {issue.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Meals ({allData?.meals?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allData?.meals?.slice(0, 3).map((meal: any) => (
                    <div key={meal.id} className="text-sm">
                      <div className="font-medium capitalize">{meal.meal_type}</div>
                      <div className="text-muted-foreground">{meal.menu}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Room Assignments ({allData?.roomAssignments?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allData?.roomAssignments?.slice(0, 3).map((assignment: any) => (
                    <div key={assignment.id} className="flex justify-between items-center text-sm">
                      <span>₹{assignment.monthly_rent}/mo</span>
                      <Badge variant={assignment.is_active ? 'default' : 'secondary'}>
                        {assignment.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rooms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Rooms ({allData?.rooms?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allData?.rooms?.slice(0, 3).map((room: any) => (
                    <div key={room.id} className="flex justify-between items-center text-sm">
                      <span>Room {room.room_number}</span>
                      <Badge variant={room.is_available ? 'default' : 'secondary'}>
                        {room.occupied}/{room.capacity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
};