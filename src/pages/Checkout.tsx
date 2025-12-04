import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Smartphone, Loader2, MapPin } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, discount, appliedCoupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addOrder } = useOrders();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    pincode: '',
  });

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!address.name || !address.phone || !address.address || !address.city || !address.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all delivery details.",
        variant: "destructive",
      });
      return false;
    }
    if (address.pincode.length !== 6) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderId = addOrder({
      items,
      totalPrice,
      discount,
      deliveryAddress: address,
      paymentMethod: paymentMethods.find(p => p.id === selectedPayment)?.name || 'Cash on Delivery',
    });

    clearCart();
    setIsLoading(false);
    
    navigate(`/order-confirmation/${orderId}`);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

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

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={address.address}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="House/Flat No., Street, Area"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                    className="input-field"
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300",
                      selectedPayment === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      selectedPayment === method.id ? "bg-primary text-primary-foreground" : "bg-secondary"
                    )}>
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <div className={cn(
                      "ml-auto w-5 h-5 rounded-full border-2",
                      selectedPayment === method.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {selectedPayment === method.id && (
                        <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card rounded-2xl p-6 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-semibold">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount ({appliedCoupon})</span>
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
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full btn-primary-gradient rounded-xl h-14 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  `Place Order - $${totalPrice.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
