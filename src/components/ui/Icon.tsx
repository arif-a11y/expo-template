import React from "react";
import { View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
} as const;

export interface IconProps extends Omit<ViewProps, "children"> {
  children: React.ReactNode;
  size?: keyof typeof iconSizes;
  className?: string;
}

/**
 * Simple Icon wrapper for SVG components
 * Use className for custom sizes and colors
 *
 * @example
 * ```tsx
 * <Icon size="md" className="text-primary">
 *   <CheckSvg />
 * </Icon>
 * ```
 */
export function Icon({
  children,
  size = "md",
  className,
  ...props
}: IconProps) {
  return (
    <View
      className={cn("items-center justify-center", iconSizes[size], className)}
      {...props}
    >
      {children}
    </View>
  );
}
