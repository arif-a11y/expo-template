import { useState } from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { Loader } from '@/components/ui/Loader';
import { Google, Apple } from '@assets/icons';
import { useGoogleOAuth, useAppleOAuth } from '../hooks/useAuth';
import { cn } from '@/lib/utils';

const socialButtonVariants = {
  container: "flex-row justify-center items-center gap-4",
  button: {
    base: "w-12 h-12 rounded-full border border-border items-center justify-center bg-background",
    active: "active:bg-accent",
  },
} as const;

interface SocialSignInButtonsProps {
  disabled?: boolean;
}

export function SocialSignInButtons({ disabled }: SocialSignInButtonsProps) {
  const { signInWithGoogle } = useGoogleOAuth();
  const { signInWithApple } = useAppleOAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') return;
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      await signInWithApple();
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') return;
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <View className={socialButtonVariants.container}>
      <TouchableOpacity
        onPress={handleGoogleSignIn}
        disabled={disabled || googleLoading || appleLoading}
        className={cn(socialButtonVariants.button.base, socialButtonVariants.button.active)}
      >
        {googleLoading ? (
          <Loader size="sm" />
        ) : (
          <Google width={20} height={20} />
        )}
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity
          onPress={handleAppleSignIn}
          disabled={disabled || googleLoading || appleLoading}
          className={cn(socialButtonVariants.button.base, socialButtonVariants.button.active)}
        >
          {appleLoading ? (
            <Loader size="sm" />
          ) : (
            <Apple width={20} height={20} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
