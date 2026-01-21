import { Pressable, PressableProps } from 'react-native';
import { cn } from '@/lib/utils';

const buttonVariants = {
  base: 'rounded-lg flex-row items-center justify-center active:opacity-80',
  variant: {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'border-2 border-primary bg-transparent',
    ghost: 'bg-transparent',
    destructive: 'bg-destructive',
  },
  size: {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  },
} as const;

export interface ButtonProps extends PressableProps {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      className={cn(
        buttonVariants.base,
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </Pressable>
  );
}
