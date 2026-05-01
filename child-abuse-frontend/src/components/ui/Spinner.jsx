import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Spinner = React.forwardRef(({ 
  className, 
  size = 'md',
  color = 'secondary',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'border-t-primary-500',
    secondary: 'border-t-secondary-600',
    white: 'border-t-white',
    gray: 'border-t-gray-600',
  };

  const classes = twMerge(
    clsx(
      'spinner',
      sizeClasses[size],
      colorClasses[color],
      className
    )
  );

  return (
    <div 
      ref={ref}
      className={classes}
      role="status"
      aria-label="Loading..."
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
