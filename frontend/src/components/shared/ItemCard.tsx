import { LostItem } from '@/types';
import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const statusStyles: Record<string, string> = {
  available: 'bg-success/10 text-success',
  claimed: 'bg-warning/10 text-warning',
  delivered: 'bg-info/10 text-info',
};

const ItemCard = ({ item, index = 0 }: { item: LostItem; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
    className="h-full"
  >
    <Link to={`/item/${item.id}`} className="group block bento-box h-full overflow-hidden hover:-translate-y-2 relative">
      <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative h-48 overflow-hidden rounded-t-[1.3rem]">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
            <span className="text-muted-foreground text-xs uppercase tracking-widest font-semibold flex items-center gap-2"><MapPin className="w-4 h-4" /> No Image</span>
          </div>
        )}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${item.status === 'available' ? 'bg-success/20 text-success border-success/30' : item.status === 'claimed' ? 'bg-warning/20 text-warning border-warning/30' : 'bg-info/20 text-info border-info/30'}`}>
          {item.status}
        </span>
      </div>
      <div className="p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-foreground group-hover:text-primary transition-colors text-lg leading-tight">{item.name}</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
        </div>
        <div className="flex items-center justify-between mt-5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />{item.location}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" />{item.date}</span>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default ItemCard;
