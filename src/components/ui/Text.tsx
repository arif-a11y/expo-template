import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cn } from '@/lib/utils';

const textVariants = {
  h1: 'text-4xl font-inter-bold text-foreground',
  h2: 'text-3xl font-inter-bold text-foreground',
  h3: 'text-2xl font-inter-semibold text-foreground',
  h4: 'text-xl font-inter-semibold text-foreground',
  h5: 'text-lg font-inter-semibold text-foreground',
  h6: 'text-base font-inter-semibold text-foreground',
  body: 'text-base font-inter-medium text-foreground',
  bodyLarge: 'text-lg font-inter-medium text-foreground',
  bodySmall: 'text-sm font-inter-medium text-foreground',
  caption: 'text-sm font-inter text-muted-foreground',
  label: 'text-sm font-inter-medium text-foreground',
  overline: 'text-xs font-inter uppercase tracking-wider text-muted-foreground',
} as const;

export interface TextProps extends RNTextProps {
  variant?: keyof typeof textVariants;
  className?: string;
  color?: 'primary' | 'secondary' | 'muted' | 'destructive' | 'success' ;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

const colorMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted-foreground',
  destructive: 'text-destructive',
  success: 'text-green-600',
} as const;


const weightMap = {
  normal: 'font-inter',
  medium: 'font-inter-medium',
  semibold: 'font-inter-semibold',
  bold: 'font-inter-bold',
} as const;

export function Text({
  variant = 'body',
  className,
  color,
  weight,
  ...props
}: TextProps) {
  return (
    <RNText
      maxFontSizeMultiplier={1.3}
      className={cn(
        textVariants[variant],
        color && colorMap[color],
        weight && weightMap[weight],
        className
      )}
      {...props}
    />
  );
}
