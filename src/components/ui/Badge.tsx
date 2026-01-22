import { View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

const badgeVariants = {
  base: "rounded-full px-2.5 py-0.5 flex-row items-center justify-center",
  variant: {
    default: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    destructive: "bg-destructive",
    outline: "border border-border bg-transparent",
  },
  size: {
    sm: "px-2 py-0.5",
    md: "px-2.5 py-0.5",
    lg: "px-3 py-1",
  },
} as const;

export interface BadgeProps extends ViewProps {
  variant?: keyof typeof badgeVariants.variant;
  size?: keyof typeof badgeVariants.size;
  className?: string;
  children: React.ReactNode;
}

/**
 * Simple, composable Badge component
 *
 * @example
 * ```tsx
 * <Badge variant="success" size="md">
 *   <Text variant="caption" className="text-white">Active</Text>
 * </Badge>
 * ```
 */
export function Badge({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <View
      className={cn(
        badgeVariants.base,
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
