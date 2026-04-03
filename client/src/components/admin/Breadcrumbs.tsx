import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

type Breadcrumb = {
  label: string;
  path?: string;
};

export default function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
      <Link 
         to="/admin/overview" 
         className="text-primary/30 hover:text-primary transition-colors"
      >
         ADMIN
      </Link>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4">
           <ChevronRight size={12} className="text-primary/10" />
           {item.path ? (
              <Link 
                 to={item.path} 
                 className="text-primary/30 hover:text-primary transition-colors"
              >
                 {item.label}
              </Link>
           ) : (
              <span className="text-primary">{item.label}</span>
           )}
        </div>
      ))}
    </nav>
  );
}
