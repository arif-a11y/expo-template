import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { FormField } from './FormField';
import { verifyEmailSchema, VerifyEmailFormData } from '../schemas/auth.schema';
import { useVerifyEmail } from '../hooks/useAuth';
import { STRINGS } from '@/constants';

export function VerifyEmailForm() {
  const { verifyEmail, isLoaded } = useVerifyEmail();
  const { control, handleSubmit, setError, formState: { errors } } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      await verifyEmail(data.code);
    } catch (err: any) {
      setError('root', {
        message: err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || STRINGS.ERRORS.VERIFICATION_FAILED,
      });
    }
  };

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text variant="h1" className="text-foreground">
          {STRINGS.AUTH.VERIFY_EMAIL_TITLE}
        </Text>
        <Text variant="body" className="text-muted-foreground">
          {STRINGS.AUTH.VERIFY_EMAIL_DESC}
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
          {STRINGS.AUTH.VERIFY}
        </Text>
      </Button>
    </View>
  );
}
