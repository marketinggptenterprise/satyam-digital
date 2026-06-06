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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Plus, Trash2, Edit, Package, Tag, Briefcase, LogOut, Image as ImageIcon, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { showSuccess } from '../utils/toast';
import { isSupabaseConfigured } from '../lib/supabase';
import { Product, Banner } from '../types/store';

const Admin = () => {
  const { 
    products, 
    categories, 
    brands, 
    banners, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    deleteCategory, 
    addBrand, 
    deleteBrand, 
    addBanner, 
    updateBanner, 
    deleteBanner 
  } = useStore();
  
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

  // Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    brandId: '',
    image: '',
    images: ['', '', '', '', ''] // 5 image slots
  });

  // Banner Form State
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    badge: '',
    image: '',
    link: '#'
  });

  // Category & Brand Form State
  const [newCat, setNewCat] = useState('');
  const [newBrand, setNewBrand] = useState('');

  // Edit Dialog States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty image URLs
    const validImages = newProduct.images.filter(img => img.trim() !== '');
    const primaryImage = validImages[0] || newProduct.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800';

    addProduct({
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      categoryId: newProduct.categoryId,
      brandId: newProduct.brandId,
      image: primaryImage,
      images: validImages.length > 0 ? validImages : [primaryImage]
    });

    setNewProduct({ 
      name: '', 
      description: '', 
      price: '', 
      categoryId: '', 
      brandId: '', 
      image: '', 
      images: ['', '', '', '', ''] 
    });
    showSuccess('Product added successfully!');
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Filter out empty image URLs
    const validImages = (editingProduct.images || []).filter(img => img.trim() !== '');
    const primaryImage = validImages[0] || editingProduct.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800';

    updateProduct({
      ...editingProduct,
      image: primaryImage,
      images: validImages.length > 0 ? validImages : [primaryImage]
    });

    setEditingProduct(null);
    showSuccess('Product updated successfully!');
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    addBanner(newBanner);
    setNewBanner({ title: '', subtitle: '', badge: '', image: '', link: '#' });
    showSuccess('Banner added successfully!');
  };

  const handleUpdateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    updateBanner(editingBanner);
    setEditingBanner(null);
    showSuccess('Banner updated successfully!');
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
                  Connected to Supabase! All products, categories, and banners are synced in real-time across all devices.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store inventory, banners, and categories</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[550px]">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" /> Products
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

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Fill in the details and add up to 5 image links for the product carousel.</CardDescription>
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

                  {/* 5 Image Links */}
                  <div className="space-y-3 md:col-span-2 border p-4 rounded-xl bg-muted/10">
                    <Label className="font-bold text-primary">Product Images (Up to 5 links)</Label>
                    <div className="grid gap-2">
                      {newProduct.images.map((img, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground w-6">#{idx + 1}</span>
                          <Input 
                            placeholder={`https://example.com/image-${idx + 1}.jpg`}
                            value={img}
                            onChange={e => {
                              const updatedImages = [...newProduct.images];
                              updatedImages[idx] = e.target.value;
                              setNewProduct({...newProduct, images: updatedImages});
                            }}
                          />
                        </div>
                      ))}
                    </div>
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
                  <Button type="submit" className="md:col-span-2 gap-2 bg-primary hover:bg-primary/90 font-bold">
                    <Plus className="h-4 w-4" /> Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <Card key={product.id} className="flex flex-col justify-between">
                  <div>
                    <div className="aspect-video overflow-hidden rounded-t-lg relative bg-white flex items-center justify-center p-2">
                      <img 
                        src={product.images?.[0] || product.image} 
                        alt={product.name} 
                        className="h-full object-contain" 
                      />
                      {product.images && product.images.filter(img => img.trim() !== '').length > 1 && (
                        <Badge className="absolute bottom-2 right-2 bg-primary text-white">
                          {product.images.filter(img => img.trim() !== '').length} Images
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      <p className="mt-2 font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                    </CardContent>
                  </div>
                  <div className="p-4 pt-0 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1 gap-2"
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

          {/* BANNERS TAB */}
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
                  <Button type="submit" className="md:col-span-2 gap-2 bg-primary hover:bg-primary/90 font-bold">
                    <Plus className="h-4 w-4" /> Add Banner
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {banners.map(banner => (
                <Card key={banner.id} className="overflow-hidden flex flex-col justify-between">
                  <div className="aspect-video relative">
                    <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
                      <Badge className="w-fit mb-2 bg-secondary text-primary font-bold">{banner.badge}</Badge>
                      <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                      <p className="text-white/80 text-xs line-clamp-1">{banner.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={() => setEditingBanner(banner)}
                    >
                      <Edit className="h-4 w-4" /> Edit Banner
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1 gap-2"
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

          {/* CATEGORIES TAB */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>Add or delete product categories.</CardDescription>
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
                  }} className="bg-primary hover:bg-primary/90 font-bold">Add</Button>
                </div>
                <div className="grid gap-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex flex-col">
                        <span className="font-bold">{cat.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {cat.id}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          deleteCategory(cat.id);
                          showSuccess('Category deleted');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BRANDS TAB */}
          <TabsContent value="brands" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Brands</CardTitle>
                <CardDescription>Add or delete product brands.</CardDescription>
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
                  }} className="bg-primary hover:bg-primary/90 font-bold">Add</Button>
                </div>
                <div className="grid gap-2">
                  {brands.map(brand => (
                    <div key={brand.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex flex-col">
                        <span className="font-bold">{brand.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {brand.id}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          deleteBrand(brand.id);
                          showSuccess('Brand deleted');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* EDIT PRODUCT DIALOG */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProduct} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingProduct.name} 
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input 
                  id="edit-price" 
                  type="number" 
                  value={editingProduct.price} 
                  onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={editingProduct.categoryId} 
                    onValueChange={val => setEditingProduct({...editingProduct, categoryId: val})}
                  >
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
                <div className="grid gap-2">
                  <Label htmlFor="edit-brand">Brand</Label>
                  <Select 
                    value={editingProduct.brandId} 
                    onValueChange={val => setEditingProduct({...editingProduct, brandId: val})}
                  >
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
              </div>

              {/* Edit 5 Image Links */}
              <div className="space-y-3 border p-4 rounded-xl bg-muted/10">
                <Label className="font-bold text-primary">Product Images (Up to 5 links)</Label>
                <div className="grid gap-2">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const currentImages = editingProduct.images || [];
                    const val = currentImages[idx] || '';
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-6">#{idx + 1}</span>
                        <Input 
                          placeholder={`https://example.com/image-${idx + 1}.jpg`}
                          value={val}
                          onChange={e => {
                            const updatedImages = [...currentImages];
                            // Ensure array is padded to at least this index
                            while (updatedImages.length <= idx) {
                              updatedImages.push('');
                            }
                            updatedImages[idx] = e.target.value;
                            setEditingProduct({...editingProduct, images: updatedImages});
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea 
                  id="edit-desc" 
                  value={editingProduct.description} 
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  required 
                />
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 font-bold">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* EDIT BANNER DIALOG */}
      {editingBanner && (
        <Dialog open={!!editingBanner} onOpenChange={(open) => !open && setEditingBanner(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Banner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateBanner} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-btitle">Title</Label>
                <Input 
                  id="edit-btitle" 
                  value={editingBanner.title} 
                  onChange={e => setEditingBanner({...editingBanner, title: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-bbadge">Badge Text</Label>
                <Input 
                  id="edit-bbadge" 
                  value={editingBanner.badge} 
                  onChange={e => setEditingBanner({...editingBanner, badge: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-bsub">Subtitle</Label>
                <Input 
                  id="edit-bsub" 
                  value={editingBanner.subtitle} 
                  onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-bimage">Image URL</Label>
                <Input 
                  id="edit-bimage" 
                  value={editingBanner.image} 
                  onChange={e => setEditingBanner({...editingBanner, image: e.target.value})}
                  required 
                />
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingBanner(null)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 font-bold">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Admin;