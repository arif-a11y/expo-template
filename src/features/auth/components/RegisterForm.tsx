import { View, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@clerk/clerk-expo';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { FormField, SocialSignInButtons } from '@/features/auth/components';
import { registerSchema, RegisterFormData } from '../schemas/auth.schema';
import { STRINGS } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { Email, Person } from '@assets/icons';

export function RegisterForm() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { control, handleSubmit, setError, formState: { isSubmitting, errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const [firstName, ...lastNameParts] = data.name.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      const result = await signUp!.create({
        emailAddress: data.email,
        password: data.password,
        firstName,
        lastName: lastName || undefined,
      });

      if (result.status === 'missing_requirements') {
        await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
        router.push(ROUTES.AUTH.VERIFY_EMAIL);
      } else if (result.status === 'complete') {
        await setActive!({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError('root', {
        message: err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Failed to sign up',
      });
    }
  };

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text variant="h1" className="text-foreground">
          {STRINGS.AUTH.CREATE_ACCOUNT}
        </Text>
        <Text variant="body" className="text-muted-foreground">
          Sign up to get started
        </Text>
      </View>

      <View className="gap-4">
        <FormField
          control={control}
          name="name"
          label={STRINGS.AUTH.NAME}
          placeholder="John Doe"
          autoCapitalize="words"
          autoComplete="name"
          leftIcon={<Person width={20} height={20} className="text-muted-foreground" />}
        />

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
          placeholder="Create a password"
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
              {STRINGS.AUTH.REGISTER}
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
          {STRINGS.AUTH.ALREADY_HAVE_ACCOUNT}
        </Text>
        <Link href={ROUTES.AUTH.LOGIN} asChild>
          <TouchableOpacity>
            <Text variant="body" className="text-primary font-inter-semibold">
              {STRINGS.AUTH.LOGIN}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
