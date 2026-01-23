import { TextInput, TextInputProps } from 'react-native';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const inputVariants = {
  base: 'px-4 py-3 font-inter text-base text-foreground',
  variant: {
    default: 'rounded-lg border border-input bg-background',
    outline: 'rounded-lg border-2 border-primary bg-background',
    filled: 'rounded-lg bg-secondary/10 border-0',
    underline: 'rounded-none border-b-2 border-input bg-transparent px-0',
  },
  state: {
    error: 'border-destructive',
    success: 'border-green-600',
    disabled: 'opacity-50 bg-muted',
    focused: 'border-primary',
  },
} as const;

export interface InputProps extends TextInputProps {
  variant?: keyof typeof inputVariants.variant;
  state?: keyof typeof inputVariants.state;
  className?: string;
}

/**
 * Simple, composable Input component
 * Wrap in a View with icons for more complex layouts
 *
 * @example
 * ```tsx
 * <Input
 *   variant="default"
 *   placeholder="Enter text"
 *   value={value}
 *   onChangeText={setValue}
 * />
 * ```
 */
export function Input({
  variant = 'default',
  state,
  className,
  editable,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <TextInput
      editable={editable}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(
        inputVariants.base,
        inputVariants.variant[variant],
        state && inputVariants.state[state],
        isFocused && !state && inputVariants.state.focused,
        !editable && inputVariants.state.disabled,
        className
      )}
      {...props}
    />
  );
}
