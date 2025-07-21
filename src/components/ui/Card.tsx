import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = true 
}) => {
  const baseClasses = 'card-premium rounded-2xl animate-fade-in';
  const hoverClasses = hover ? 'hover-lift' : '';
  
  const paddings = {
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-10',
  };

  return (
    <div className={`${baseClasses} ${hoverClasses} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;