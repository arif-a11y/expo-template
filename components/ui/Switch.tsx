import { Switch as RNSwitch, SwitchProps as RNSwitchProps, View } from "react-native";
import { cn } from "@/lib/utils";

export interface SwitchProps extends RNSwitchProps {
  className?: string;
}

/**
 * Simple, composable Switch component
 *
 * @example
 * ```tsx
 * <Switch
 *   value={enabled}
 *   onValueChange={setEnabled}
 * />
 * ```
 */
export function Switch({
  className,
  ...props
}: SwitchProps) {
  return (
    <View className={cn("", className)}>
      <RNSwitch {...props} />
    </View>
  );
}
