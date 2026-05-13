import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  const classes = twMerge(
    clsx(
      'form-textarea',
      error && 'border-critical focus:ring-critical',
      className
    )
  );

  return <textarea className={classes} ref={ref} {...props} />;
});

Textarea.displayName = 'Textarea';

export default Textarea;
