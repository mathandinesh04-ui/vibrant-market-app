import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ChevronRight } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  pending: 'bg-warning/20 text-warning',
  confirmed: 'bg-primary/20 text-primary',
  processing: 'bg-accent/20 text-accent-foreground',
  shipped: 'bg-success/20 text-success',
  delivered: 'bg-success/20 text-success',
};

export default function Orders() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <CartDrawer />
        
        <main className="container px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
              <Package className="w-16 h-16 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Sign in to view orders</h1>
            <p className="text-muted-foreground mb-6">Track your orders and view order history</p>
            <Button onClick={() => navigate('/signin')} className="btn-primary-gradient rounded-xl">
              Sign In
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

        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-32 h-32 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
              <Package className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Button onClick={() => navigate('/')} className="btn-primary-gradient rounded-xl">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={order.id}
                onClick={() => navigate(`/order-confirmation/${order.id}`)}
                className="glass-card rounded-2xl p-6 cursor-pointer hover:shadow-elevated transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono font-bold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium capitalize",
                    statusColors[order.status]
                  )}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map((item, i) => (
                      <img
                        key={item.product.id}
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-card"
                        style={{ zIndex: 3 - i }}
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 rounded-xl bg-secondary border-2 border-card flex items-center justify-center text-sm font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-primary">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
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
