import { useState, useMemo } from 'react';
import { products } from '@/data/products';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { HeroSection } from '@/components/HeroSection';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <CartDrawer />
      
      <main>
        <HeroSection />
        
        {/* Products Section */}
        <section id="products" className="container px-4 py-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Fresh Products</h2>
              <p className="text-muted-foreground mt-1">Handpicked quality for your kitchen</p>
            </div>
            <div className="w-full md:w-80">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory} 
            />
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter</p>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="bg-secondary/50 py-16">
          <div className="container px-4">
            <h2 className="text-2xl font-bold text-center text-foreground mb-12">Why Choose FreshMart?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center animate-fade-in stagger-1">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-4">
                  <span className="text-3xl">🚚</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">Get your groceries delivered in under 30 minutes</p>
              </div>
              <div className="text-center animate-fade-in stagger-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-4">
                  <span className="text-3xl">🌿</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Farm Fresh</h3>
                <p className="text-muted-foreground">Sourced directly from local farms</p>
              </div>
              <div className="text-center animate-fade-in stagger-3">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
                <p className="text-muted-foreground">Competitive prices with regular discounts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8">
          <div className="container px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-lg">🥬</span>
              </div>
              <span className="text-lg font-bold">FreshMart</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 FreshMart. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-muted-foreground text-sm">Try coupons:</span>
              <code className="px-2 py-1 rounded bg-muted text-sm">FRESH10</code>
              <code className="px-2 py-1 rounded bg-muted text-sm">SAVE20</code>
              <code className="px-2 py-1 rounded bg-muted text-sm">WELCOME15</code>
            </div>
          </div>
        </footer>
      </main>

      <MobileNav />
    </div>
  );
};

export default Index;
