import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={ROUTES.TABS.HOME} />;
  }

  return (
    <Stack
      screenOptions={{headerShown: false}}
    />
  );
}
