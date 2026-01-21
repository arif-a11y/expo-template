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
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-grow justify-center px-6 py-8 gap-6">
          <View className="gap-2">
            <Text variant="h1" className="text-center">
              {STRINGS.HOME.WELCOME}
            </Text>
            <Text variant="body" className="text-center text-muted-foreground">
              {STRINGS.HOME.SUBTITLE}
            </Text>
          </View>

          <Card variant="default">
            <View className="gap-3">
              <Text variant="h3">Features</Text>
              <Text variant="caption">✓ NativeWind (Tailwind CSS)</Text>
              <Text variant="body">✓ Dark mode support</Text>
              <Text variant="body">✓ TypeScript strict mode</Text>
              <Text variant="body">✓ React Query + Zustand</Text>
              <Text variant="body">✓ Path aliases configured</Text>
              <Text variant="body">✓ {isTablet ? 'Tablet' : 'Phone'} detected</Text>
            </View>
          </Card>

          <Button variant="primary" size="lg">
            <Text className="text-primary-foreground font-inter-semibold">
              Get Started
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
