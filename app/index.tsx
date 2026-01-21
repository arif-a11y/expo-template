import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button } from '@/components/ui';
import { STRINGS } from '@/constants/strings';
import { useResponsive } from '@/hooks/useResponsive';

export default function HomeScreen() {
  const { isTablet } = useResponsive();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <View className="gap-2">
            <Text variant="h1" className="text-center">
              {STRINGS.HOME.WELCOME}
            </Text>
            <Text variant="body">
              {STRINGS.HOME.SUBTITLE}
            </Text>
          </View>

          <Card variant="default">
            <View className="gap-3">
              <Text variant="h3">Features</Text>
              <Text variant="body">✓ NativeWind (Tailwind CSS)</Text>
              <Text variant="body">✓ Dark mode support</Text>
              <Text variant="body">✓ TypeScript strict mode</Text>
              <Text variant="body">✓ React Query + Zustand</Text>
              <Text variant="body">✓ Path aliases configured</Text>
              <Text variant="body">✓ {isTablet ? 'Tablet' : 'Phone'} detected</Text>
            </View>
          </Card>

          <Button variant="primary" size="md">
            <Text className="text-primary-foreground font-inter-semibold">
              Get Started
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
