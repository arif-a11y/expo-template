import { TextInput, TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

const inputVariants = {
  base: 'px-4 py-3 rounded-lg border border-input font-inter text-base bg-background text-foreground',
} as const;

export interface InputProps extends TextInputProps {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(inputVariants.base, className)}
      {...props}
    />
  );
}
