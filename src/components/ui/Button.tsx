import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';
  
  const variants = {
    primary: 'btn-gradient-primary text-white shadow-lg hover:shadow-xl focus:ring-blue-400/50',
    secondary: 'glass-effect border border-white/30 text-gray-700 hover:bg-white/20 focus:ring-blue-400/50 backdrop-blur-sm',
    outline: 'border-2 border-gray-300 bg-white/80 text-gray-700 hover:bg-white focus:ring-blue-400/50 hover-lift',
    ghost: 'text-gray-700 hover:bg-white/20 focus:ring-gray-400/50 hover-lift',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-xl focus:ring-red-400/50 hover-lift',
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={iconSize} className="mr-2" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={iconSize} className="ml-2" />}
    </button>
  );
};

export default Button;