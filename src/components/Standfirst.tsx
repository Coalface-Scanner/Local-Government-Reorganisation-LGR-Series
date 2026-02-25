import React from 'react';

interface StandfirstProps {
  children: React.ReactNode;
  className?: string;
}

export default function Standfirst({ children, className = '' }: StandfirstProps) {
  return (
    <div className={`standfirst-wrapper ${className}`}>
      <div className="standfirst-label">Summary</div>
      <div className="standfirst">
        {children}
      </div>
    </div>
  );
}
