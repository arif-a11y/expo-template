import { Pressable, PressableProps } from "react-native";
import { cn } from "@/lib/utils";

const buttonVariants = {
  base: "rounded-lg flex-row items-center justify-center",
  variant: {
    primary: "bg-primary",
    secondary: "bg-secondary",
    outline: "border-2 border-primary bg-transparent",
    ghost: "bg-transparent",
    destructive: "bg-destructive",
    success: "bg-green-600",
    warning: "bg-yellow-600",
  },
  size: {
    xs: "px-2 py-1.5 min-h-[32px]",
    sm: "px-3 py-2 min-h-[36px]",
    md: "px-4 py-3 min-h-[44px]",
    lg: "px-6 py-4 min-h-[52px]",
    xl: "px-8 py-5 min-h-[60px]",
  },
  disabled: "opacity-disabled",
} as const;

export interface ButtonProps extends PressableProps {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  className?: string;
  children: React.ReactNode;
}

/**
 * Simple, composable Button component
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" className="gap-2">
 *   <Icon size={20}><CheckSvg /></Icon>
 *   <Text variant="label">Save</Text>
 * </Button>
 * ```
 */
export function Button({
  variant = "primary",
  size = "md",
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
        disabled && buttonVariants.disabled,
        className,
      )}
      {...props}
    >
      {children}
    </Pressable>
  );
}
