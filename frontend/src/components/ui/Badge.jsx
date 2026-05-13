import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const badgeVariants = {
  variant: {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    critical: 'badge-critical',
  },
};

const Badge = React.forwardRef(({ className, variant = 'primary', ...props }, ref) => {
  const classes = twMerge(
    clsx(
      'badge',
      badgeVariants.variant[variant],
      className
    )
  );

  return <div ref={ref} className={classes} {...props} />;
});

Badge.displayName = 'Badge';

export default Badge;
