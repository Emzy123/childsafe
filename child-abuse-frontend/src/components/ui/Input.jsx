import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  const classes = twMerge(
    clsx(
      'form-input',
      error && 'border-critical focus:ring-critical',
      className
    )
  );

  return (
    <input
      type={type}
      className={classes}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
