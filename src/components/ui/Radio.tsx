import { Pressable, PressableProps, View } from "react-native";
import { cn } from "@/lib/utils";

const radioVariants = {
  base: "w-5 h-5 rounded-full border-2 items-center justify-center",
  state: {
    selected: "border-primary",
    unselected: "border-input",
  },
  disabled: "opacity-50",
} as const;

const dotVariants = {
  base: "w-3 h-3 bg-primary rounded-full",
} as const;

export interface RadioProps extends Omit<PressableProps, 'onPress'> {
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

/**
 * Simple, composable Radio component
 *
 * @example
 * ```tsx
 * <Radio
 *   selected={value === 'option1'}
 *   onSelect={() => setValue('option1')}
 * />
 * ```
 */
export function Radio({
  selected = false,
  onSelect,
  disabled,
  className,
  ...props
}: RadioProps) {
  return (
    <Pressable
      onPress={onSelect}
      disabled={disabled}
      className={cn(
        radioVariants.base,
        selected ? radioVariants.state.selected : radioVariants.state.unselected,
        disabled && radioVariants.disabled,
        className
      )}
      {...props}
    >
      {selected && <View className={dotVariants.base} />}
    </Pressable>
  );
}
