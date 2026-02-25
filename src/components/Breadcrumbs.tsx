import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import BreadcrumbStructuredData from './BreadcrumbStructuredData';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [{ label: 'Home', path: '/' }, ...items];

  return (
    <>
      <BreadcrumbStructuredData items={fullItems} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
          <li>
            {items.length === 0 ? (
              <span className="flex items-center gap-1 text-slate-900 font-medium" aria-current="page">
                <Home size={14} aria-hidden="true" />
                Home
              </span>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-teal-700 transition-colors"
                aria-label="Home"
              >
                <Home size={14} aria-hidden="true" />
                <span className="sr-only">Home</span>
              </Link>
            )}
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-slate-400" aria-hidden="true" />
              {item.path != null ? (
                <Link
                  to={item.path}
                  className="hover:text-teal-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
