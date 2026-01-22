import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Input, InputProps } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import { Lock, Eye, EyeOff } from '@assets/icons';

const formFieldVariants = {
  iconContainer: {
    left: 'absolute left-3 top-1/2 -translate-y-1/2 z-10',
    right: 'absolute right-3 top-1/2 -translate-y-1/2 z-10',
  },
  inputPadding: {
    left: 'pl-11',
    right: 'pr-11',
    both: 'pl-11 pr-11',
  },
} as const;

interface FormFieldProps<T extends FieldValues> extends Omit<InputProps, 'value' | 'onChangeText' | 'secureTextEntry'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  leftIcon,
  rightIcon,
  isPassword = false,
  ...inputProps
}: FormFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const getPaddingClass = () => {
    if ((leftIcon || isPassword) && (rightIcon || isPassword)) return formFieldVariants.inputPadding.both;
    if (leftIcon || isPassword) return formFieldVariants.inputPadding.left;
    if (rightIcon) return formFieldVariants.inputPadding.right;
    return '';
  };

  const finalLeftIcon = isPassword ? <Lock width={20} height={20} className="text-muted-foreground" /> : leftIcon;
  const finalRightIcon = isPassword ? (
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      {showPassword ? (
        <EyeOff width={20} height={20} className="text-muted-foreground" />
      ) : (
        <Eye width={20} height={20} className="text-muted-foreground" />
      )}
    </TouchableOpacity>
  ) : rightIcon;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="gap-1.5">
          <Text variant="label" className="text-foreground">
            {label}
          </Text>
          <View className="relative">
            {finalLeftIcon && (
              <View className={formFieldVariants.iconContainer.left}>
                {finalLeftIcon}
              </View>
            )}
            {finalRightIcon && (
              <View className={formFieldVariants.iconContainer.right}>
                {finalRightIcon}
              </View>
            )}
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={isPassword && !showPassword}
              state={error ? 'error' : undefined}
              className={cn(getPaddingClass())}
              {...inputProps}
            />
          </View>
          {error && (
            <Text variant="caption" className="text-destructive">
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}
