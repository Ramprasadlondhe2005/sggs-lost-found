import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ItemCard from '@/components/shared/ItemCard';
const categories = ['All', 'Electronics', 'Documents', 'Accessories', 'Books', 'Clothing', 'Keys', 'Other'];
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { LostItem } from '@/types';

const fetchItems = async (): Promise<LostItem[]> => {
  const { data } = await api.get('/items');
  if (data.success && data.items) {
    return data.items.map((item: any) => ({
      ...item,
      id: item._id,
      name: item.title,
      date: new Date(item.foundDate || item.createdAt).toLocaleDateString(),
    }));
  }
  return [];
};

const LostItems = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(debouncedSearch.toLowerCase()));
    const matchesCat = category === 'All' || item.category === category;
    return matchesSearch && matchesCat;
  });

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="page-container py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4 tracking-wide border border-primary/20">LIVE DATABASE</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Lost <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 text-glow">Items Gallery</span>
          </h1>
          <p className="text-muted-foreground mt-1">Browse the central repository of all found belongings on campus.</p>
        </motion.div>

        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center max-w-5xl mx-auto mb-12">
          <div className="relative flex-1 w-full flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by keywords, markings, or brand..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-secondary/50 backdrop-blur-md text-foreground text-sm focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
            {(search || category !== 'All') && (
              <button
                onClick={clearFilters}
                className="px-6 py-4 bg-background border border-border text-foreground hover:bg-secondary rounded-2xl text-sm font-bold transition-all whitespace-nowrap shadow-sm hover:shadow-md"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto whitespace-nowrap pb-2 sm:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm ${category === cat ? 'bg-primary text-primary-foreground shadow-primary/30 glow-border' : 'bg-secondary border border-border text-foreground hover:bg-background'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center"><p className="text-muted-foreground">Loading items...</p></div>
        ) : isError ? (
          <div className="py-16 flex justify-center"><p className="text-destructive">Failed to load items. Please try again later.</p></div>
        ) : (
          <motion.div layout>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-0"
            >
              {filtered.map((item, i) => (
                <ItemCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No items found matching your search.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LostItems;
