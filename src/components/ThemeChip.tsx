interface ThemeChipProps {
  theme: string;
  variant?: 'primary' | 'secondary';
}

/**
 * ThemeChip Component
 * 
 * Small badge component for displaying theme tags on cards and articles.
 * Used to visually categorize content by theme (Governance and Reform, Democratic Legitimacy, Statecraft and System Design).
 */
export default function ThemeChip({ theme, variant = 'primary' }: ThemeChipProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-display font-semibold transition-colors';
  
  const variantClasses = variant === 'primary'
    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
    : 'bg-teal-50 text-teal-700 border border-teal-200';

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {theme}
    </span>
  );
}
