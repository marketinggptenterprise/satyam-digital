"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Trash2, Package, Tag, Briefcase, LogOut, Image as ImageIcon, ShoppingBag, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { showSuccess } from '../utils/toast';
import { OrderStatus } from '../types/store';
import { isSupabaseConfigured } from '../lib/supabase';

const Admin = () => {
  const { products, categories, brands, banners, orders, addProduct, deleteProduct, addCategory, addBrand, addBanner, deleteBanner, updateOrderStatus } = useStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    brandId: '',
    image: ''
  });

  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    badge: '',
    image: '',
    link: '#'
  });

  const [newCat, setNewCat] = useState('');
  const [newBrand, setNewBrand] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      ...newProduct,
      price: Number(newProduct.price)
    });
    setNewProduct({ name: '', description: '', price: '', categoryId: '', brandId: '', image: '' });
    showSuccess('Product added successfully!');
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    addBanner(newBanner);
    setNewBanner({ title: '', subtitle: '', badge: '', image: '', link: '#' });
    showSuccess('Banner added successfully!');
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    showSuccess(`Order ${orderId} updated to ${status}`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container py-8">
        {/* Database Connection Status Banner */}
        {!isSupabaseConfigured ? (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-xl shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-amber-800">Local Storage Mode (No Cloud Sync)</h3>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Your products are currently being saved <strong>only on this computer's browser</strong>. 
                  To make them visible on other devices (like your mobile phone), you must configure your Supabase environment variables 
                  (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">VITE_SUPABASE_ANON_KEY</code>) 
                  in your Vercel project settings.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6 rounded-r-xl shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-emerald-800">Cloud Sync Active</h3>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  Connected to Supabase! All products, categories, and orders are synced in real-time across all devices.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store inventory and orders</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[650px]">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" /> Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="banners" className="gap-2">
              <ImageIcon className="h-4 w-4" /> Banners
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Tag className="h-4 w-4" /> Categories
            </TabsTrigger>
            <TabsTrigger value="brands" className="gap-2">
              <Briefcase className="h-4 w-4" /> Brands
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input 
                      id="name" 
                      value={newProduct.name} 
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      value={newProduct.price} 
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={val => setNewProduct({...newProduct, categoryId: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select onValueChange={val => setNewProduct({...newProduct, brandId: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(brand => (
                          <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input 
                      id="image" 
                      placeholder="https://..." 
                      value={newProduct.image} 
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea 
                      id="desc" 
                      value={newProduct.description} 
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      required 
                    />
                  </div>
                  <Button type="submit" className="md:col-span-2 gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" /> Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <Card key={product.id} className="flex flex-col">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <p className="mt-2 font-bold">₹{product.price.toLocaleString('en-IN')}</p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => {
                        deleteProduct(product.id);
                        showSuccess('Product deleted');
                      }}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Manage customer orders and fulfillment</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-bold">{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{order.items}</TableCell>
                        <TableCell>₹{order.total.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={order.status} 
                            onValueChange={(val) => handleStatusChange(order.id, val as OrderStatus)}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Processing">Processing</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Hero Banner</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBanner} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="btitle">Title</Label>
                    <Input 
                      id="btitle" 
                      value={newBanner.title} 
                      onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bbadge">Badge Text (e.g. SALE)</Label>
                    <Input 
                      id="bbadge" 
                      value={newBanner.badge} 
                      onChange={e => setNewBanner({...newBanner, badge: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bsub">Subtitle</Label>
                    <Input 
                      id="bsub" 
                      value={newBanner.subtitle} 
                      onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bimage">Image URL</Label>
                    <Input 
                      id="bimage" 
                      placeholder="https://..." 
                      value={newBanner.image} 
                      onChange={e => setNewBanner({...newBanner, image: e.target.value})}
                      required 
                    />
                  </div>
                  <Button type="submit" className="md:col-span-2 gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" /> Add Banner
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {banners.map(banner => (
                <Card key={banner.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
                      <Badge className="w-fit mb-2">{banner.badge}</Badge>
                      <h3 className="text-white font-bold">{banner.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => {
                        deleteBanner(banner.id);
                        showSuccess('Banner deleted');
                      }}
                    >
                      <Trash2 className="h-4 w-4" /> Remove Banner
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="New Category Name" 
                    value={newCat} 
                    onChange={e => setNewCat(e.target.value)} 
                  />
                  <Button onClick={() => {
                    if(newCat) {
                      addCategory(newCat);
                      setNewCat('');
                      showSuccess('Category added');
                    }
                  }}>Add</Button>
                </div>
                <div className="grid gap-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <span>{cat.name}</span>
                      <Badge variant="secondary">{cat.id}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brands" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Brands</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="New Brand Name" 
                    value={newBrand} 
                    onChange={e => setNewBrand(e.target.value)} 
                  />
                  <Button onClick={() => {
                    if(newBrand) {
                      addBrand(newBrand);
                      setNewBrand('');
                      showSuccess('Brand added');
                    }
                  }}>Add</Button>
                </div>
                <div className="grid gap-2">
                  {brands.map(brand => (
                    <div key={brand.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <span>{brand.name}</span>
                      <Badge variant="secondary">{brand.id}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;