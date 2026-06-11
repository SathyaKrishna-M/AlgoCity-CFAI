import * as React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none',
        {
          'bg-primary/10 text-primary': variant === 'default',
          'bg-secondary/10 text-secondary': variant === 'success',
          'bg-accent/10 text-accent': variant === 'warning',
          'bg-danger/10 text-danger': variant === 'danger',
          'text-gray-950 border border-gray-200': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
