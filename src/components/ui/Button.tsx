import { useState } from "react";
import { Pressable, PressableProps } from "react-native";
import { cn } from "@/lib/utils";
import { Loader } from "./Loader";

const buttonVariants = {
  base: "rounded-lg flex-row items-center justify-center",
  variant: {
    primary: "bg-primary",
    secondary: "bg-secondary",
    outline: "border-2 border-primary bg-transparent",
    ghost: "bg-transparent",
    destructive: "bg-destructive",
    success: "bg-green-600",
  },
  size: {
    xs: "px-2 py-1.5",
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
    xl: "px-8 py-5",
  },
  disabled: "opacity-disabled",
} as const;

type AsyncOnPress = () => Promise<void>;

export interface ButtonProps extends Omit<PressableProps, 'onPress'> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
  onPress?: AsyncOnPress | (() => void);
}

/**
 * Button component with automatic loading state management
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onPress={async () => await saveData()}>
 *   <Text variant="label">Save</Text>
 * </Button>
 * ```
 */
export function Button({
  variant = "primary",
  size = "md",
  disabled,
  loading: externalLoading,
  className,
  children,
  onPress,
  ...props
}: ButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading || internalLoading;

  const handlePress = async () => {
    if (!onPress || loading) return;

    const result = onPress();

    if (result instanceof Promise) {
      setInternalLoading(true);
      try {
        await result;
      } finally {
        setInternalLoading(false);
      }
    }
  };

  return (
    <Pressable
      disabled={disabled || loading}
      className={cn(
        buttonVariants.base,
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        (disabled || loading) && buttonVariants.disabled,
        className,
      )}
      onPress={handlePress}
      {...props}
    >
      {loading ? <Loader size="md" /> : children}
    </Pressable>
  );
}
