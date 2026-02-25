import { Link } from 'react-router-dom';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * InternalLink component for consistent internal link styling
 * Handles both article and material routes
 */
export default function InternalLink({ href, children, className = '', onClick }: InternalLinkProps) {
  // If it's already a full URL or external, use regular anchor
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) {
    return (
      <a
        href={href}
        className={`internal-link ${className}`}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  // Internal route - use React Router Link
  return (
    <Link
      to={href}
      className={`internal-link ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
