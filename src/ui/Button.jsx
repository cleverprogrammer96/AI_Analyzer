import React from 'react';

/**
 * Button component - abstraction layer for easy component library swapping
 * 
 * To swap with your org's component library:
 * 1. Import your org's Button component
 * 2. Map the variant prop to your library's prop names
 * 3. Keep the same API surface
 */
export const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  disabled = false, 
  type = 'button',
  className = '',
  ...rest 
}) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    icon: 'btn-icon',
    default: 'btn-default',
  };

  const buttonClass = `btn ${variantClasses[variant] || variantClasses.default} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
