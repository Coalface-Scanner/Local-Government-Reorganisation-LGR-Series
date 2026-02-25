import type { ReactNode } from 'react';

export type ContentContainerVariant = 'hub' | 'subject' | 'sub';

interface ContentContainerProps {
  variant?: ContentContainerVariant;
  children: ReactNode;
  className?: string;
}

/**
 * Single global content container: max-width, gutters, and vertical padding.
 * Use for all hub, subject, and sub pages so width and spacing are consistent.
 * - hub: main content block below banner (e.g. Learn, About, Tools).
 * - subject: same as hub (section landing pages).
 * - sub: inner content pages (e.g. Methodology, What is LGR).
 */
export function ContentContainer({
  variant = 'hub',
  children,
  className = '',
}: ContentContainerProps) {
  const paddingClass =
    variant === 'sub' ? 'layout-content-sub' : 'layout-content-hub';
  return (
    <div
      className={`layout-container ${paddingClass} ${className}`.trim()}
      data-layout-variant={variant}
    >
      {children}
    </div>
  );
}

export default ContentContainer;
