import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, Tag, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalPrice, discount, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to proceed with checkout.",
      });
      navigate('/signin');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <CartDrawer />
        
        <main className="container px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
              <span className="text-6xl">🛒</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={() => navigate('/')} className="btn-primary-gradient rounded-xl">
              Start Shopping
            </Button>
          </div>
        </main>

        <MobileNav />
      </div>
    );
  }

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

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 rounded-2xl bg-card border border-border animate-fade-in">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} / {item.product.unit}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive shrink-0"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-9 h-9 rounded-lg"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-9 h-9 rounded-lg"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              {/* Coupon */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Have a coupon?</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 text-success">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span className="font-medium">{appliedCoupon}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 hover:bg-success/20"
                      onClick={removeCoupon}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 rounded-xl bg-secondary border border-border focus:outline-none focus:border-primary"
                    />
                    <Button onClick={handleApplyCoupon} variant="outline" className="rounded-xl">
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full btn-primary-gradient rounded-xl h-14 text-lg"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
