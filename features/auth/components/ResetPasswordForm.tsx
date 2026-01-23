import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { FormField } from './FormField';
import { resetPasswordSchema, ResetPasswordFormData } from '../schemas/auth.schema';
import { useResetPassword } from '../hooks/useAuth';
import { STRINGS } from '@/constants';

export function ResetPasswordForm() {
  const { resetPassword, isLoaded } = useResetPassword();
  const { control, handleSubmit, setError, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(data.code, data.password);
    } catch (err: any) {
      setError('root', {
        message: err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || STRINGS.ERRORS.RESET_PASSWORD_FAILED,
      });
    }
  };

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text variant="h1" className="text-foreground">
          {STRINGS.AUTH.RESET_PASSWORD}
        </Text>
        <Text variant="body" className="text-muted-foreground">
          {STRINGS.AUTH.RESET_PASSWORD_FORM_DESC}
        </Text>
      </View>

      <View className="gap-4">
        <FormField
          control={control}
          name="code"
          label={STRINGS.AUTH.VERIFICATION_CODE}
          placeholder={STRINGS.AUTH.PLACEHOLDER_CODE}
          keyboardType="number-pad"
          autoCapitalize="none"
        />

        <FormField
          control={control}
          name="password"
          label={STRINGS.AUTH.PASSWORD}
          placeholder={STRINGS.AUTH.PLACEHOLDER_NEW_PASSWORD}
          autoCapitalize="none"
          autoComplete="password-new"
          isPassword
        />

        <FormField
          control={control}
          name="confirmPassword"
          label={STRINGS.AUTH.CONFIRM_PASSWORD}
          placeholder={STRINGS.AUTH.PLACEHOLDER_CONFIRM_PASSWORD}
          autoCapitalize="none"
          autoComplete="password-new"
          isPassword
        />

        {errors.root && (
          <View className="p-3 bg-destructive/10 rounded-lg">
            <Text variant="bodySmall" className="text-destructive">
              {errors.root.message}
            </Text>
          </View>
        )}
      </View>

      <Button
        variant="primary"
        size="lg"
        onPress={handleSubmit(onSubmit)}
        disabled={!isLoaded}
      >
        <Text className="text-primary-foreground font-inter-semibold">
          {STRINGS.AUTH.RESET_PASSWORD}
        </Text>
      </Button>
    </View>
  );
}
