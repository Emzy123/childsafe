import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';

const alertVariants = {
  variant: {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
    critical: 'alert-critical',
  },
};

const alertIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  critical: AlertCircle,
};

const Alert = React.forwardRef(({ 
  className, 
  variant = 'info', 
  dismissible = false,
  onDismiss,
  children,
  ...props 
}, ref) => {
  const Icon = alertIcons[variant];
  const classes = twMerge(
    clsx(
      'alert',
      alertVariants.variant[variant],
      className
    )
  );

  return (
    <div ref={ref} className={classes} role="alert" {...props}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3 flex-1">
          {children}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

Alert.displayName = 'Alert';

export default Alert;
