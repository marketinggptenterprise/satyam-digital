import { Product, Category, Brand } from '../types/store';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
  category?: Category;
  brand?: Brand;
}

export const ProductCard = ({ product, category, brand }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
            {brand?.name}
          </Badge>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
            {category?.name}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>
        <p className="text-2xl font-bold text-primary">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
      </CardContent>
    </Card>
  );
};