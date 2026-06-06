import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Trash2, Package, Tag, Briefcase } from 'lucide-react';
import { showSuccess } from '../utils/toast';

const Admin = () => {
  const { products, categories, brands, addProduct, deleteProduct, addCategory, addBrand } = useStore();
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    brandId: '',
    image: ''
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

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" /> Products
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
                  <Button type="submit" className="md:col-span-2 gap-2">
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