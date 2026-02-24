import { Search as SearchIcon } from 'lucide-react';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { useState } from 'react';

const Search = () => {
  const [query, setQuery] = useState('');

  return (
    <StorefrontLayout>
      <div className="container py-20 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl tracking-[0.15em] mb-8 text-center">SEARCH</h1>
        <div className="relative mb-12">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-surface border border-border pl-12 pr-4 py-4 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
            autoFocus
          />
        </div>
        {!query && (
          <div className="text-center text-muted-foreground text-sm tracking-wider">
            <p>Start typing to search our collections</p>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default Search;
