import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { STRINGS } from "@/constants";

export default function ProfilePage() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-grow px-6 py-8 gap-6">
          <Text variant="h1" className="text-foreground">
            {STRINGS.PROFILE.TITLE}
          </Text>

          <Card variant="default">
            <View className="gap-3">
              <Text variant="h3" className="text-foreground">
                {STRINGS.PROFILE.ACCOUNT_INFO}
              </Text>
              <View className="gap-2">
                <Text variant="body" className="text-muted-foreground">
                  {STRINGS.PROFILE.EMAIL_LABEL}
                </Text>
              </View>
              <View className="gap-2">
                <Text variant="body" className="text-muted-foreground">
                  {STRINGS.PROFILE.NAME_LABEL}
                </Text>
              </View>
            </View>
          </Card>

          <Button
            variant="destructive"
            size="lg"
            onPress={signOut}
          >
            <Text className="text-destructive-foreground font-inter-semibold">
              {STRINGS.AUTH.LOGOUT}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
