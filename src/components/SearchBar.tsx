import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search products..." }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn(
      "relative flex items-center transition-all duration-300",
      isFocused && "ring-2 ring-primary/30"
    )}>
      <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:border-primary transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
