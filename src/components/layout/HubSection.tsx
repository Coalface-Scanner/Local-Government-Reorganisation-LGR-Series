import type { ReactNode } from 'react';

interface HubSectionProps {
  children: ReactNode;
  /** Section heading (optional). Use consistent h2 + optional subline. */
  heading?: ReactNode;
  className?: string;
}

/**
 * Section block on hub/subject pages. Uses consistent bottom spacing (layout-section).
 */
export function HubSection({ children, heading, className = '' }: HubSectionProps) {
  return (
    <section className={`layout-section ${className}`.trim()}>
      {heading && <div className="mb-4">{heading}</div>}
      {children}
    </section>
  );
}

export default HubSection;
