import { type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/** Fixed height for the coloured headline band so all service cards align site-wide */
export const SERVICE_CARD_HEADER_HEIGHT = '11.25rem'; /* 180px */

export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  /** When set, card is a link to this route. Otherwise use onClick. */
  route?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
  /** Render as button (e.g. LGR Hub overview). Default: div when onClick, Link when route. */
  asButton?: boolean;
  /** Extra class for the wrapper (e.g. md:col-span-2 for featured card). */
  className?: string;
  /** Show "Explore" link/CTA. Default true. Set false for non-navigable cards (e.g. overview). */
  showExplore?: boolean;
}

export default function ServiceCard({
  id,
  title,
  description,
  icon: Icon,
  color,
  route,
  onClick,
  disabled = false,
  badge,
  asButton = false,
  className = '',
  showExplore = true,
}: ServiceCardProps) {
  const headerClasses = `service-card-header h-[11.25rem] flex-shrink-0 bg-gradient-to-br ${color} p-6 md:p-8 text-white flex flex-col justify-between ${disabled ? 'opacity-50' : ''}`;
  const iconClasses = `w-12 h-12 md:w-14 md:h-14 bg-white/20 flex items-center justify-center rounded-lg flex-shrink-0 mb-4 transition-transform ${disabled ? '' : 'group-hover:scale-110'}`;
  const titleClasses = 'text-academic-lg md:text-academic-xl font-display font-bold text-white leading-tight line-clamp-3';
  const bodyClasses = 'p-6 md:p-8 flex-1 flex flex-col min-h-0';
  const descriptionClasses = `leading-relaxed mb-4 flex-1 font-serif text-academic-sm md:text-academic-base line-clamp-4 overflow-hidden ${disabled ? 'text-academic-neutral-500' : 'text-academic-neutral-700'}`;

  const content = (
    <>
      <div className={headerClasses}>
        <div className="flex flex-col flex-1 min-h-0">
          {badge && (
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider text-white/90 border border-white/30">
                {badge}
              </span>
            </div>
          )}
          <div className={iconClasses}>
            <Icon className="text-white" size={28} />
          </div>
          <h2 className={`${titleClasses} mt-auto`}>{title}</h2>
          {disabled && (
            <p className="text-academic-sm text-white/80 mt-2 italic font-serif">Coming soon</p>
          )}
        </div>
      </div>
      <div className={bodyClasses}>
        <p className={descriptionClasses}>{description}</p>
        {!disabled && showExplore && (
          <div className="flex items-center gap-2 text-teal-700 font-display font-semibold group-hover:gap-3 transition-all mt-auto pt-2">
            <span>Explore</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </>
  );

  const cardClasses = `group academic-card overflow-hidden transition-all duration-300 text-left h-full flex flex-col ${
    disabled
      ? 'bg-academic-warm border-academic-neutral-300 cursor-not-allowed opacity-60'
      : 'cursor-pointer hover:border-teal-700'
  } ${className}`;

  if (asButton) {
    return (
      <button
        type="button"
        onClick={disabled ? undefined : (onClick ?? (route ? () => {} : undefined))}
        className={cardClasses}
        disabled={disabled}
      >
        {content}
      </button>
    );
  }

  if (route && !disabled) {
    return (
      <Link to={route} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={cardClasses}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
