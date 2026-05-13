import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
  const classes = twMerge(
    clsx(
      'form-select',
      error && 'border-critical focus:ring-critical',
      className
    )
  );

  return (
    <select className={classes} ref={ref} {...props}>
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Select;
