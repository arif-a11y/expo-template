import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

const loaderVariants = {
  size: {
    sm: "small" as const,
    md: "small" as const,
    lg: "large" as const,
  },
} as const;

export interface LoaderProps extends Omit<ActivityIndicatorProps, 'size'> {
  size?: keyof typeof loaderVariants.size;
}

export function Loader({
  size = "md",
  ...props
}: LoaderProps) {
  return <ActivityIndicator size={loaderVariants.size[size]} {...props} />;
}
