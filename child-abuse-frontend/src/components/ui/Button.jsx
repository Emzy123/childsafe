import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const buttonVariants = {
  variant: {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success',
  },
  size: {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl',
  },
};

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled,
  children,
  ...props 
}, ref) => {
  const baseClasses = 'btn';
  const variantClasses = buttonVariants.variant[variant];
  const sizeClasses = buttonVariants.size[size];
  
  const classes = twMerge(
    clsx(
      baseClasses,
      variantClasses,
      sizeClasses,
      (loading || disabled) && 'opacity-50 cursor-not-allowed',
      className
    )
  );

  return (
    <button
      type={props.type || 'button'}
      className={classes}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
