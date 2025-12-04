import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Heart, ShoppingCart, Star, Leaf, Truck, Shield } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/')}>Go back to shop</Button>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <CartDrawer />

      <main className="container px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-secondary animate-fade-in">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isOrganic && (
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-success text-success-foreground text-sm font-medium">
                  <Leaf className="w-4 h-4" />
                  Organic
                </span>
              )}
              {product.originalPrice && (
                <span className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlistToggle}
              className={cn(
                "absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                "bg-card/90 backdrop-blur-sm hover:bg-card shadow-soft",
                inWishlist && "text-destructive"
              )}
            >
              <Heart className={cn("w-6 h-6", inWishlist && "fill-current")} />
            </button>
          </div>

          {/* Info */}
          <div className="space-y-6 animate-slide-up">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < Math.floor(product.rating)
                        ? "fill-warning text-warning"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-muted-foreground">/ {product.unit}</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isOutOfStock ? "bg-destructive" : "bg-success"
              )} />
              <span className={cn(
                "font-medium",
                isOutOfStock ? "text-destructive" : "text-success"
              )}>
                {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            {!isOutOfStock && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-4 bg-secondary rounded-xl p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-lg"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="w-12 text-center text-xl font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary-gradient rounded-xl h-14 text-lg gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">Orders over $30</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Quality Guarantee</p>
                  <p className="text-xs text-muted-foreground">Fresh or refund</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
