import React from 'react';

interface KeyFindingProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function KeyFinding({ title, children, className = '' }: KeyFindingProps) {
  return (
    <div className={`key-finding ${className}`}>
      {title && (
        <h3 className="key-finding-title">{title}</h3>
      )}
      <div className="key-finding-content">
        {children}
      </div>
    </div>
  );
}
