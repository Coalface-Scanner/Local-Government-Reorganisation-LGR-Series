/**
 * StructuredContent Component
 * 
 * Provides structured content blocks optimized for AI search and SEO:
 * - Timelines (ordered lists with dates)
 * - Before/After comparisons (tables)
 * - Key takeaways (bulleted lists)
 */

import { Calendar, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
}

interface ComparisonRow {
  aspect: string;
  before: string;
  after: string;
}

interface StructuredContentProps {
  type: 'timeline' | 'comparison' | 'takeaways';
  title?: string;
  data?: TimelineItem[] | ComparisonRow[] | string[];
  className?: string;
}

export default function StructuredContent({
  type,
  title,
  data,
  className = ''
}: StructuredContentProps) {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  switch (type) {
    case 'timeline':
      return (
        <div className={`bg-slate-50 border border-slate-200 rounded-lg p-6 ${className}`}>
          {title && (
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="text-teal-700" size={20} />
              {title}
            </h3>
          )}
          <ol className="space-y-4">
            {(data as TimelineItem[]).map((item, index) => (
              <li key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-24 text-sm font-semibold text-teal-700">
                  {item.date}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">{item.title}</div>
                  {item.description && (
                    <p className="text-sm text-slate-600">{item.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      );

    case 'comparison':
      return (
        <div className={`bg-slate-50 border border-slate-200 rounded-lg p-6 ${className}`}>
          {title && (
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ArrowRight className="text-teal-700" size={20} />
              {title}
            </h3>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left p-3 font-bold text-slate-900">Aspect</th>
                  <th className="text-left p-3 font-bold text-slate-900">Before</th>
                  <th className="text-left p-3 font-bold text-slate-900">After</th>
                </tr>
              </thead>
              <tbody>
                {(data as ComparisonRow[]).map((row, index) => (
                  <tr key={index} className="border-b border-slate-200">
                    <td className="p-3 font-semibold text-slate-900">{row.aspect}</td>
                    <td className="p-3 text-slate-700">{row.before}</td>
                    <td className="p-3 text-slate-700">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'takeaways':
      return (
        <div className={`bg-teal-50 border-2 border-teal-200 rounded-lg p-6 ${className}`}>
          {title && (
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-teal-700" size={20} />
              {title}
            </h3>
          )}
          <ul className="space-y-3">
            {(data as string[]).map((takeaway, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="text-teal-700 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-slate-700 leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}

/**
 * Timeline Component (convenience wrapper)
 */
export function Timeline({ items, title, className }: { items: TimelineItem[]; title?: string; className?: string }) {
  return <StructuredContent type="timeline" title={title} data={items} className={className} />;
}

/**
 * Comparison Component (convenience wrapper)
 */
export function Comparison({ rows, title, className }: { rows: ComparisonRow[]; title?: string; className?: string }) {
  return <StructuredContent type="comparison" title={title} data={rows} className={className} />;
}

/**
 * Takeaways Component (convenience wrapper)
 */
export function Takeaways({ items, title, className }: { items: string[]; title?: string; className?: string }) {
  return <StructuredContent type="takeaways" title={title} data={items} className={className} />;
}
