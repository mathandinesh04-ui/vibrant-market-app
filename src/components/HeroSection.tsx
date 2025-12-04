import { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-grocery.jpg';

export function HeroSection() {
  const navigate = useNavigate();
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[70vh] md:min-h-[80vh] flex items-center">
      {/* Parallax Background */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <img
          src={heroImage}
          alt="Fresh groceries"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-12 md:py-20">
        <div className="max-w-2xl space-y-6 animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Fresh Delivery Daily</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="text-foreground">Fresh</span>
            <br />
            <span className="text-gradient">Groceries</span>
            <br />
            <span className="text-foreground">Delivered</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
            Get farm-fresh produce, dairy, meat, and pantry essentials delivered to your doorstep in under 30 minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              size="lg"
              className="btn-primary-gradient rounded-xl h-14 px-8 text-lg gap-2 group"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl h-14 px-8 text-lg"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-8">
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">30min</p>
              <p className="text-sm text-muted-foreground">Delivery</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">4.9★</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
