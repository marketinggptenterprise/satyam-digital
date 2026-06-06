"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { useCart } from '../hooks/useCart';
import { Navbar } from '../components/Navbar';
import { BreadcrumbNav } from '../components/BreadcrumbNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label'; // Added missing import
import { Plus, Minus, ShoppingCart, Star, MessageSquare, Phone } from 'lucide-react';
import { showError, showSuccess } from '../utils/toast';
import useEmblaCarousel from 'embla-carousel-react';
import { Separator } from '@/components/ui/separator';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, categories, brands } = useStore();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === productId);

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imagesList = product?.images && product.images.filter(img => img.trim() !== '').length > 0
    ? product.images.filter(img => img.trim() !== '')
    : (product?.image ? [product.image] : []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => setCurrentImageIndex(emblaApi.selectedScrollSnap()));
    }
  }, [emblaApi]);

  useEffect(() => {
    // Reset quantity and image index when product changes
    setQuantity(1);
    setCurrentImageIndex(0);
    emblaApi?.scrollTo(0);
  }, [productId, emblaApi]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950">
        <Navbar />
        <main className="container py-12 flex-grow">
          <Card className="p-8 text-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">The product you are looking for does not exist or has been removed.</p>
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl font-bold">
              <Link to="/">Go to Home</Link>
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);
  const brand = brands.find(b => b.id === product.brandId);
  
  const originalPrice = product.price * 1.5; // Simulate a higher original price
  const discountAmount = originalPrice - product.price;
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: quantity });
    showSuccess(`${quantity}x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity: quantity }); // For now, Buy Now acts like Add to Cart
    showSuccess(`${quantity}x ${product.name} added to cart. Proceeding to checkout (feature coming soon!).`);
    // In a real app, you would navigate to a checkout page here.
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/#products' }, // Link to products section on home
    { label: category?.name || 'Category', href: `/?cat=${category?.id}` },
    { label: product.name, href: `/product/${product.id}` },
  ];

  const whatsappPhoneNumber = "919932026227"; // Your WhatsApp number
  const callPhoneNumber = "+919932026227"; // Your call number

  const handleWhatsAppEnquiry = () => {
    const message = encodeURIComponent(`Hello, I'm interested in the product: ${product.name} (ID: ${product.id}). Can you tell me more about it?`);
    window.open(`https://wa.me/${whatsappPhoneNumber}?text=${message}`, '_blank');
  };

  const handleCallEnquiry = () => {
    window.open(`tel:${callPhoneNumber}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
      <Navbar />
      <main className="container py-8 md:py-12 flex-grow">
        <div className="mb-6">
          <BreadcrumbNav items={breadcrumbItems} />
        </div>

        <Card className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 shadow-2xl rounded-3xl">
          {/* Product Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-muted/30 border border-border/50">
              <div className="embla" ref={emblaRef}>
                <div className="embla__container flex">
                  {imagesList.map((img, index) => (
                    <div className="embla__slide flex-[0_0_100%] min-w-0 h-[400px] flex items-center justify-center p-4" key={index}>
                      <img 
                        src={img} 
                        alt={`${product.name} - Image ${index + 1}`} 
                        className="h-full w-full object-contain max-h-[calc(100%-20px)]"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {imagesList.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/60 hover:bg-white/80 dark:bg-zinc-800/60 dark:hover:bg-zinc-800/80 border border-white/80 dark:border-zinc-700/80 text-gray-800 dark:text-gray-100 shadow-md"
                    onClick={() => emblaApi?.scrollPrev()}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/60 hover:bg-white/80 dark:bg-zinc-800/60 dark:hover:bg-zinc-800/80 border border-white/80 dark:border-zinc-700/80 text-gray-800 dark:text-gray-100 shadow-md"
                    onClick={() => emblaApi?.scrollNext()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {imagesList.length > 1 && (
              <div className="flex gap-3 justify-center">
                {imagesList.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`h-16 w-16 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                      index === currentImageIndex ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => emblaApi?.scrollTo(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {brand && (
                  <Badge className="bg-secondary text-primary font-bold text-xs rounded-full px-3 py-1">
                    {brand.name.toUpperCase()}
                  </Badge>
                )}
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.8)</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-primary">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white font-bold text-sm rounded-full px-3 py-1 animate-pulse">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                You save ₹{discountAmount.toLocaleString('en-IN')}!
              </p>
              <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <Label htmlFor="quantity" className="text-base font-bold text-gray-800 dark:text-white">Quantity:</Label>
              <div className="flex items-center border border-input rounded-xl overflow-hidden bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none hover:bg-muted"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-bold text-gray-800 dark:text-white">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none hover:bg-muted"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 rounded-xl text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>

            {/* Enquire Directly */}
            <CardContent className="p-6 mt-6 bg-muted/20 border border-input/50 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Enquire directly:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-5 rounded-xl text-base shadow-md"
                  onClick={handleWhatsAppEnquiry}
                >
                  <MessageSquare className="h-5 w-5 mr-2" /> WhatsApp
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-xl text-base shadow-md"
                  onClick={handleCallEnquiry}
                >
                  <Phone className="h-5 w-5 mr-2" /> Call Us
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ProductDetail;