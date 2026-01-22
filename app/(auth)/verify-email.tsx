import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VerifyEmailForm } from '@/features/auth/components/VerifyEmailForm';

export default function VerifyEmailPage() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-grow px-6 py-8">
          <VerifyEmailForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
