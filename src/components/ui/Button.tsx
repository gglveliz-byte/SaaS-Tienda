'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:disabled:scale-100 active:scale-[0.97]'

    const variants = {
      primary:   'bg-[#FFC107] hover:bg-[#EBB413] text-[#1C1C1E] focus:ring-amber-400 shadow-sm',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300',
      danger:    'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400',
      ghost:     'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300',
      outline:   'border border-gray-200 hover:bg-gray-50 text-gray-700 focus:ring-gray-300',
    }

    const sizes = {
      sm: 'min-h-[36px] px-3 py-1.5 text-sm',
      md: 'min-h-[44px] px-5 py-2.5 text-sm',
      lg: 'min-h-[50px] px-7 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
