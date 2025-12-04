import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, totalItems, totalPrice, updateQuantity, removeFromCart, discount, appliedCoupon } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-card z-50 shadow-elevated transition-transform duration-300 ease-out",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {totalItems}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-8rem)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
              <Button onClick={() => { setIsCartOpen(false); navigate('/'); }} className="btn-primary-gradient">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-3 rounded-xl bg-secondary/50 animate-fade-in">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground line-clamp-1">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} / {item.product.unit}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 rounded-lg"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 rounded-lg"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
            {appliedCoupon && (
              <div className="flex items-center justify-between text-sm text-success mb-2">
                <span>Discount ({appliedCoupon})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full btn-primary-gradient rounded-xl h-12 text-lg"
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
