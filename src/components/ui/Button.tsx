import * as React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all': variant === 'default',
            'border border-white/10 bg-transparent hover:bg-white/5 text-gray-300 shadow-sm hover:border-white/20 transition-all': variant === 'outline',
            'hover:bg-white/5 text-gray-400': variant === 'ghost',
            'bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]': variant === 'danger',
            'h-8 px-3 text-xs': size === 'sm',
            'h-9 px-4 py-2': size === 'md',
            'h-10 px-8 text-base': size === 'lg',
            'h-9 w-9': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
