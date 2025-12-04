import { Link } from 'react-router-dom';
import { Heart, Plus, Star, Leaf } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn(
        "product-card group block animate-fade-in",
        isOutOfStock && "opacity-60"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isOrganic && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-success text-success-foreground text-xs font-medium">
              <Leaf className="w-3 h-3" />
              Organic
            </span>
          )}
          {product.originalPrice && (
            <span className="px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
            "bg-card/90 backdrop-blur-sm hover:bg-card",
            inWishlist && "text-destructive"
          )}
        >
          <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-destructive text-destructive-foreground font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        {!isOutOfStock && (
          <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full btn-primary-gradient rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">/{product.unit}</span>
        </div>
      </div>
    </Link>
  );
}
