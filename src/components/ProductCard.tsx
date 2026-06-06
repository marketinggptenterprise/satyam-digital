import { Product, Category, Brand } from '../types/store';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  category?: Category;
  brand?: Brand;
}

export const ProductCard = ({ product, category, brand }: ProductCardProps) => {
  const discountPrice = product.price * 1.2; // Mock original price for UI

  return (
    <Card className="group relative bg-white border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
      <div className="absolute top-2 left-2 z-10">
        <Badge className="bg-secondary text-primary font-bold text-[10px] border-none">
          OFFER
        </Badge>
      </div>
      
      <div className="aspect-square p-4 overflow-hidden bg-white">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="h-3 w-3 fill-secondary text-secondary" />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">(4.5)</span>
        </div>
        
        <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
          {brand?.name}
        </p>
        
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 h-10 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-black text-primary">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹{discountPrice.toLocaleString('en-IN')}
          </span>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-lg gap-2">
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};