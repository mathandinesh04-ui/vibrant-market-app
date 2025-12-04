import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export function MobileNav() {
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/?search=true' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Account', path: '/signin' },
  ];

  return (
    <nav className="mobile-nav md:hidden pb-safe">
      {navItems.map((item) => (
        item.label === 'Search' ? (
          <button
            key={item.label}
            onClick={() => setIsCartOpen(false)}
            className="mobile-nav-item"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </button>
        ) : (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.label === 'Cart' && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </Link>
        )
      ))}
    </nav>
  );
}
