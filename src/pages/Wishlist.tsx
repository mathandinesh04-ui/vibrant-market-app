import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';

export default function Wishlist() {
  const navigate = useNavigate();
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (productId: string) => {
    const product = items.find(p => p.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <CartDrawer />

      <main className="container px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearWishlist} className="text-destructive hover:text-destructive">
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-32 h-32 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
              <Heart className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save items you love to your wishlist</p>
            <Button onClick={() => navigate('/')} className="btn-primary-gradient rounded-xl">
              Explore Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((product, index) => (
              <div
                key={product.id}
                className="glass-card rounded-2xl overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="relative aspect-video cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.originalPrice && (
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {product.category}
                  </p>
                  <h3 
                    className="font-semibold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      className="flex-1 btn-primary-gradient rounded-xl gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl text-destructive hover:text-destructive"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
