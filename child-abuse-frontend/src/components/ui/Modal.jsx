import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X } from 'lucide-react';

const Modal = React.forwardRef(({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnOverlayClick = true,
  className,
  ...props 
}, ref) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-container">
          <div 
            ref={ref}
            className={twMerge(
              clsx(
                'modal-panel',
                sizeClasses[size],
                className
              )
            )}
            {...props}
          >
            {/* Header */}
            {(title || onClose) && (
              <div className="flex items-center justify-between p-6 border-b border-border-light">
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {onClose && (
                  <button
                    onClick={onClose}
                    className="ml-4 h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                )}
              </div>
            )}
            
            {/* Body */}
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;
