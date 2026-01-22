import { View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

const cardVariants = {
  base: "rounded-lg p-4",
  variant: {
    default: "bg-background border border-border shadow-md",
    outline: "border-2 border-primary bg-transparent",
    ghost: "bg-transparent",
  },
} as const;

export interface CardProps extends ViewProps {
  variant?: keyof typeof cardVariants.variant;
  className?: string;
  children: React.ReactNode;
}

export function Card({
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <View
      className={cn(
        cardVariants.base,
        cardVariants.variant[variant],
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
