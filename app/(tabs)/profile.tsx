import { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { Card } from "@/components/ui/Card";
import { STRINGS } from "@/constants";

export default function ProfilePage() {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-grow px-6 py-8 gap-6">
          <Text variant="h1" className="text-foreground">
            Profile
          </Text>

          <Card variant="default">
            <View className="gap-3">
              <Text variant="h3" className="text-foreground">
                Account Information
              </Text>
              <View className="gap-2">
                <Text variant="body" className="text-muted-foreground">
                  Email
                </Text>
              </View>
              <View className="gap-2">
                <Text variant="body" className="text-muted-foreground">
                  Name
                </Text>
              </View>
            </View>
          </Card>

          <Button
            variant="destructive"
            size="lg"
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <Loader size="sm" />
            ) : (
              <Text className="text-destructive-foreground font-inter-semibold">
                {STRINGS.AUTH.LOGOUT}
              </Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
