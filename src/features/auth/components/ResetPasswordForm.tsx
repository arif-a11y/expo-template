import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@clerk/clerk-expo';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { FormField } from '@/features/auth/components';
import { resetPasswordSchema, ResetPasswordFormData } from '../schemas/auth.schema';
import { STRINGS } from '@/constants';

export function ResetPasswordForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { control, handleSubmit, setError, formState: { isSubmitting, errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.code,
        password: data.password,
      });

      if (result.status === 'complete') {
        await setActive!({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError('root', {
        message: err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Failed to reset password',
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
          Enter the code from your email and create a new password
        </Text>
      </View>

      <View className="gap-4">
        <FormField
          control={control}
          name="code"
          label={STRINGS.AUTH.VERIFICATION_CODE}
          placeholder="Enter 6-digit code"
          keyboardType="number-pad"
          autoCapitalize="none"
        />

        <FormField
          control={control}
          name="password"
          label={STRINGS.AUTH.PASSWORD}
          placeholder="Create a new password"
          autoCapitalize="none"
          autoComplete="password-new"
          isPassword
        />

        <FormField
          control={control}
          name="confirmPassword"
          label={STRINGS.AUTH.CONFIRM_PASSWORD}
          placeholder="Confirm your password"
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
        disabled={!isLoaded || isSubmitting}
      >
        {isSubmitting ? (
          <Loader size="sm" />
        ) : (
          <Text className="text-primary-foreground font-inter-semibold">
            {STRINGS.AUTH.RESET_PASSWORD}
          </Text>
        )}
      </Button>
    </View>
  );
}
