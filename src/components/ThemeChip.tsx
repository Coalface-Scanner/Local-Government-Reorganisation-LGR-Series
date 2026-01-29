import { useNavigate } from 'react-router-dom';

interface ThemeChipProps {
  theme: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  href?: string;
}

/**
 * ThemeChip Component
 * 
 * Small badge component for displaying theme tags on cards and articles.
 * Used to visually categorize content by theme (Governance and Reform, Democratic Legitimacy, Statecraft and System Design).
 * Can be made clickable to navigate to topic pages.
 */
export default function ThemeChip({ theme, variant = 'primary', onClick, href }: ThemeChipProps) {
  const navigate = useNavigate();
  
  const baseClasses = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-display font-semibold transition-colors';
  
  const variantClasses = variant === 'primary'
    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
    : 'bg-teal-50 text-teal-700 border border-teal-200';

  const isClickable = onClick || href;
  const clickableClasses = isClickable ? 'cursor-pointer hover:opacity-80 hover:scale-105' : '';

  const handleClick = (e: React.MouseEvent) => {
    if (isClickable) {
      e.preventDefault();
      e.stopPropagation();
      if (onClick) {
        onClick();
      } else if (href) {
        navigate(href);
      }
    }
  };

  const Component = isClickable ? 'button' : 'span';

  return (
    <Component 
      className={`${baseClasses} ${variantClasses} ${clickableClasses}`}
      onClick={handleClick}
      type={isClickable ? 'button' : undefined}
    >
      {theme}
    </Component>
  );
}
