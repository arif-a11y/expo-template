import { Image, ImageProps, View, ViewProps } from "react-native";
import { Text } from "./Text";
import { cn } from "@/lib/utils";

const avatarVariants = {
  base: "rounded-full items-center justify-center bg-muted overflow-hidden",
  size: {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  },
} as const;

const imageVariants = {
  base: "w-full h-full",
} as const;

const fallbackTextVariants = {
  base: "text-muted-foreground font-inter-semibold",
  size: {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-xl",
  },
} as const;

export interface AvatarProps extends ViewProps {
  source?: ImageProps['source'];
  fallback?: string;
  size?: keyof typeof avatarVariants.size;
  className?: string;
}

/**
 * Simple, composable Avatar component
 *
 * @example
 * ```tsx
 * <Avatar
 *   source={{ uri: 'https://example.com/avatar.jpg' }}
 *   fallback="JD"
 *   size="md"
 * />
 * ```
 */
export function Avatar({
  source,
  fallback,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  return (
    <View
      className={cn(
        avatarVariants.base,
        avatarVariants.size[size],
        className
      )}
      {...props}
    >
      {source ? (
        <Image source={source} className={imageVariants.base} />
      ) : fallback ? (
        <Text
          variant="label"
          className={cn(
            fallbackTextVariants.base,
            fallbackTextVariants.size[size]
          )}
        >
          {fallback}
        </Text>
      ) : null}
    </View>
  );
}
