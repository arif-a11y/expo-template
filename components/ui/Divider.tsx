import { View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

const dividerVariants = {
  base: "bg-border",
  orientation: {
    horizontal: "h-px w-full",
    vertical: "w-px h-full",
  },
} as const;

export interface DividerProps extends ViewProps {
  orientation?: keyof typeof dividerVariants.orientation;
  className?: string;
}

/**
 * Simple, composable Divider component
 *
 * @example
 * ```tsx
 * <Divider orientation="horizontal" />
 * ```
 */
export function Divider({
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  return (
    <View
      className={cn(
        dividerVariants.base,
        dividerVariants.orientation[orientation],
        className
      )}
      {...props}
    />
  );
}
