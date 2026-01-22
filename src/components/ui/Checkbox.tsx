import { Pressable, PressableProps, View } from "react-native";
import { cn } from "@/lib/utils";

const checkboxVariants = {
  base: "w-5 h-5 rounded border-2 items-center justify-center",
  state: {
    checked: "bg-primary border-primary",
    unchecked: "bg-background border-input",
  },
  disabled: "opacity-50",
} as const;

const checkmarkVariants = {
  base: "w-3 h-3 bg-primary-foreground rounded-sm",
} as const;

export interface CheckboxProps extends Omit<PressableProps, 'onPress'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

/**
 * Simple, composable Checkbox component
 *
 * @example
 * ```tsx
 * <Checkbox
 *   checked={isChecked}
 *   onCheckedChange={setIsChecked}
 * />
 * ```
 */
export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled,
  className,
  ...props
}: CheckboxProps) {
  return (
    <Pressable
      onPress={() => onCheckedChange?.(!checked)}
      disabled={disabled}
      className={cn(
        checkboxVariants.base,
        checked ? checkboxVariants.state.checked : checkboxVariants.state.unchecked,
        disabled && checkboxVariants.disabled,
        className
      )}
      {...props}
    >
      {checked && <View className={checkmarkVariants.base} />}
    </Pressable>
  );
}
