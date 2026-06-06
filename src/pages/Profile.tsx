"use client";

import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../hooks/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, User, CreditCard, ChevronRight, Clock } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { orders } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  // Filter orders for the current user
  const userOrders = orders.filter(order => order.customerEmail === user?.email);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please login to view your profile.</div>;

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <Navbar />
      <main className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Info */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card className="overflow-hidden border-none shadow-sm">
              <div className="h-24 bg-primary"></div>
              <CardContent className="relative pt-12 text-center">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <div className="h-24 w-24 rounded-full border-4 border-white bg-secondary flex items-center justify-center text-primary text-3xl font-black">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h2 className="text-xl font-bold">{user.user_metadata.full_name || user.email?.split('@')[0]}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-6 flex justify-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold">{userOrders.length}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Orders</p>
                  </div>
                  <div className="w-px h-8 bg-border"></div>
                  <div className="text-center">
                    <p className="text-lg font-bold">0</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Wishlist</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-2">
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 font-bold text-primary">
                  <User className="h-4 w-4" /> Account Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 font-medium">
                  <Package className="h-4 w-4" /> My Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 font-medium">
                  <MapPin className="h-4 w-4" /> Saved Addresses
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 font-medium">
                  <CreditCard className="h-4 w-4" /> Payment Methods
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="bg-white p-1 border shadow-sm">
                <TabsTrigger value="orders" className="gap-2">Order History</TabsTrigger>
                <TabsTrigger value="addresses" className="gap-2">Addresses</TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-4">
                {userOrders.length > 0 ? userOrders.map((order) => (
                  <Card key={order.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold">{order.id}</h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {order.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-primary">₹{order.total.toLocaleString('en-IN')}</p>
                          <Badge 
                            variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'} 
                            className="mt-1"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          View Details <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card className="border-none shadow-sm p-12 text-center">
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="addresses">
                <Card className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Saved Addresses</CardTitle>
                      <CardDescription>Manage your delivery locations</CardDescription>
                    </div>
                    <Button size="sm" className="bg-primary">Add New</Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border-2 border-primary/20 rounded-xl bg-primary/5 relative">
                      <Badge className="absolute top-4 right-4 bg-primary">Default</Badge>
                      <h4 className="font-bold mb-1">Home</h4>
                      <p className="text-sm text-muted-foreground">
                        123 Digital Street, Tech Park<br />
                        Bangalore, Karnataka - 560001<br />
                        Phone: +91 98765 43210
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button variant="link" className="p-0 h-auto text-xs font-bold">Edit</Button>
                        <Button variant="link" className="p-0 h-auto text-xs font-bold text-destructive">Delete</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input defaultValue={user.user_metadata.full_name || user.email?.split('@')[0]} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input defaultValue={user.email} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input placeholder="+91 00000 00000" />
                      </div>
                    </div>
                    <Button className="bg-primary">Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;