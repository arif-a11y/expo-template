import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { FormField } from './FormField';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../schemas/auth.schema';
import { useForgotPassword } from '../hooks/useAuth';
import { STRINGS } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { Email } from '@assets/icons';

export function ForgotPasswordForm() {
  const router = useRouter();
  const { sendResetCode, isLoaded } = useForgotPassword();
  const [emailSent, setEmailSent] = useState(false);
  const { control, handleSubmit, setError, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await sendResetCode(data.email);
      setEmailSent(true);
    } catch (err: any) {
      setError('root', {
        message: err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || STRINGS.ERRORS.SEND_CODE_FAILED,
      });
    }
  };

  if (emailSent) {
    return (
      <View className="gap-6">
        <View className="gap-2">
          <Text variant="h1" className="text-foreground">
            {STRINGS.AUTH.CHECK_EMAIL_TITLE}
          </Text>
          <Text variant="body" className="text-muted-foreground">
            {STRINGS.AUTH.CHECK_EMAIL_DESC}
          </Text>
        </View>

        <Button
          variant="primary"
          size="lg"
          onPress={() => router.push(ROUTES.AUTH.RESET_PASSWORD)}
        >
          <Text className="text-primary-foreground font-inter-semibold">
            {STRINGS.AUTH.CONTINUE_TO_RESET}
          </Text>
        </Button>

        <Link href={ROUTES.AUTH.LOGIN} asChild>
          <TouchableOpacity>
            <Text variant="body" className="text-primary text-center font-inter-semibold">
              {STRINGS.AUTH.BACK_TO_LOGIN}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text variant="h1" className="text-foreground">
          {STRINGS.AUTH.RESET_PASSWORD_TITLE}
        </Text>
        <Text variant="body" className="text-muted-foreground">
          {STRINGS.AUTH.RESET_PASSWORD_DESC}
        </Text>
      </View>

      <View className="gap-4">
        <FormField
          control={control}
          name="email"
          label={STRINGS.AUTH.EMAIL}
          placeholder={STRINGS.AUTH.PLACEHOLDER_EMAIL}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          leftIcon={<Email width={20} height={20} className="text-muted-foreground" />}
        />

        {errors.root && (
          <View className="p-3 bg-destructive/10 rounded-lg">
            <Text variant="bodySmall" className="text-destructive">
              {errors.root.message}
            </Text>
          </View>
        )}
      </View>

      <View className="gap-3">
        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmit(onSubmit)}
          disabled={!isLoaded}
        >
          <Text className="text-primary-foreground font-inter-semibold">
            {STRINGS.AUTH.SEND_CODE}
          </Text>
        </Button>

        <Link href={ROUTES.AUTH.LOGIN} asChild>
          <TouchableOpacity>
            <Text variant="body" className="text-primary text-center font-inter-semibold">
              {STRINGS.AUTH.BACK_TO_LOGIN}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
