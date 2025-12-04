import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, Truck, MapPin, Clock } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder } = useOrders();

  const order = getOrder(orderId || '');

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Button onClick={() => navigate('/')}>Go back to shop</Button>
        </div>
      </div>
    );
  }

  const steps = [
    { icon: CheckCircle2, label: 'Order Confirmed', done: true },
    { icon: Package, label: 'Processing', done: order.status !== 'pending' },
    { icon: Truck, label: 'Out for Delivery', done: ['shipped', 'delivered'].includes(order.status) },
    { icon: MapPin, label: 'Delivered', done: order.status === 'delivered' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <CartDrawer />

      <main className="container px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-12 animate-scale-in">
            <div className="w-24 h-24 rounded-full bg-success/20 mx-auto flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-success animate-bounce-in" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">Thank you for shopping with FreshMart</p>
          </div>

          {/* Order Details Card */}
          <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-bold text-lg">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </div>

            {/* Order Progress */}
            <div className="relative mb-8">
              <div className="absolute top-5 left-0 right-0 h-1 bg-secondary" />
              <div 
                className="absolute top-5 left-0 h-1 bg-primary transition-all duration-500"
                style={{ width: `${(steps.filter(s => s.done).length / steps.length) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                      step.done ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <p className={`mt-2 text-xs text-center ${step.done ? 'font-medium' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">Within 30-45 minutes</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Delivery Address</h3>
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="font-medium">{order.deliveryAddress.name}</p>
                <p className="text-muted-foreground">{order.deliveryAddress.phone}</p>
                <p className="text-muted-foreground">{order.deliveryAddress.address}</p>
                <p className="text-muted-foreground">{order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between text-muted-foreground mb-2">
                <span>Payment Method</span>
                <span>{order.paymentMethod}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success mb-2">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold">
                <span>Total Paid</span>
                <span className="text-primary">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/orders')}
              variant="outline"
              className="flex-1 rounded-xl h-12"
            >
              View All Orders
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="flex-1 btn-primary-gradient rounded-xl h-12"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
