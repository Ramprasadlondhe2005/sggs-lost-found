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
  >
    <Link to={`/item/${item.id}`} className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[item.status]}`}>
          {item.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default ItemCard;
