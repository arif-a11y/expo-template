import { View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@clerk/clerk-expo';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { FormField, SocialSignInButtons } from '@/features/auth/components';
import { loginSchema, LoginFormData } from '../schemas/auth.schema';
import { STRINGS } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { Email } from '@assets/icons';

export function LoginForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { control, handleSubmit, setError, formState: { isSubmitting, errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn!.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === 'complete') {
        await setActive!({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError('root', {
        message: err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Failed to sign in',
      });
    }
  };

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text variant="h1" className="text-foreground">
          {STRINGS.AUTH.WELCOME_BACK}
        </Text>
        <Text variant="body" className="text-muted-foreground">
          Sign in to continue
        </Text>
      </View>

      <View className="gap-4">
        <FormField
          control={control}
          name="email"
          label={STRINGS.AUTH.EMAIL}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          leftIcon={<Email width={20} height={20} className="text-muted-foreground" />}
        />

        <FormField
          control={control}
          name="password"
          label={STRINGS.AUTH.PASSWORD}
          placeholder="Enter your password"
          autoCapitalize="none"
          autoComplete="password"
          isPassword
        />

        <TouchableOpacity>
          <Link href={ROUTES.AUTH.FORGOT_PASSWORD} asChild>
            <Text variant="bodySmall" className="text-primary text-right">
              {STRINGS.AUTH.FORGOT_PASSWORD}
            </Text>
          </Link>
        </TouchableOpacity>

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
          disabled={!isLoaded || isSubmitting}
        >
          {isSubmitting ? (
            <Loader size="sm" />
          ) : (
            <Text className="text-primary-foreground font-inter-semibold">
              {STRINGS.AUTH.LOGIN}
            </Text>
          )}
        </Button>

        <View className="gap-3">
          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-border" />
            <Text variant="caption" className="text-muted-foreground">
              {STRINGS.AUTH.OR_CONTINUE_WITH}
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          <SocialSignInButtons disabled={!isLoaded || isSubmitting} />
        </View>
      </View>

      <View className="flex-row justify-center items-center gap-1">
        <Text variant="body" className="text-muted-foreground">
          {STRINGS.AUTH.DONT_HAVE_ACCOUNT}
        </Text>
        <Link href={ROUTES.AUTH.REGISTER} asChild>
          <TouchableOpacity>
            <Text variant="body" className="text-primary font-inter-semibold">
              {STRINGS.AUTH.REGISTER}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
