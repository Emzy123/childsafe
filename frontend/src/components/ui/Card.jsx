import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(clsx('card', className))}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(clsx('card-header', className))}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={twMerge(clsx('text-lg font-semibold leading-none tracking-tight', className))}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={twMerge(clsx('text-sm text-gray-600', className))}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardBody = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(clsx('card-body', className))}
    {...props}
  />
));
CardBody.displayName = 'CardBody';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(clsx('card-footer', className))}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter };
