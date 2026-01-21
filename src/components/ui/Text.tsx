import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cn } from '@/lib/utils';

const textVariants = {
  h1: 'text-4xl font-inter-bold text-foreground',
  h2: 'text-3xl font-inter-bold text-foreground',
  h3: 'text-2xl font-inter-semibold text-foreground',
  body: 'text-base font-inter-medium text-foreground',
  caption: 'text-sm font-inter text-muted-foreground',
} as const;

export interface TextComponentProps extends RNTextProps {
  variant?: keyof typeof textVariants;
  className?: string;
}

export function Text({
  variant = 'body',
  className,
  ...props
}: TextComponentProps) {
  return (
    <RNText
      maxFontSizeMultiplier={1.3}
      className={cn(textVariants[variant], className)}
      {...props}
    />
  );
}
