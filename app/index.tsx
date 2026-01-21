import { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Card,
  Button,
  LinkItem,
  Input,
} from "@/components/ui";
import {
  Modal,
  BottomSheet,
  AlertDialog,
  Accordion,
} from "@/components/shared";
import { STRINGS } from "@/constants/strings";
import { useResponsive } from "@/hooks/useResponsive";

export default function HomeScreen() {
  const { isTablet } = useResponsive();
  const [modalOpen, setModalOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-grow px-6 py-8 gap-6">
          <View className="gap-2">
            <Text variant="h1" className="text-center">
              {STRINGS.HOME.WELCOME}
            </Text>
            <Text variant="body" className="text-center text-muted-foreground">
              Component Showcase
            </Text>
          </View>

          {/* Text Variants */}
          <Card variant="default">
            <View className="gap-2">
              <Text variant="h3">Text Variants</Text>
              <Text variant="h4">Heading 4</Text>
              <Text variant="body">Body text - default</Text>
              <Text variant="bodySmall">Small body text</Text>
              <Text variant="caption">Caption text</Text>
              <Text variant="label">Label text</Text>
              <Text variant="overline">Overline text</Text>
            </View>
          </Card>

          {/* Input Variants */}
          <Card variant="default">
            <View className="gap-3">
              <Text variant="h3">Input Variants</Text>
              <Input
                variant="default"
                placeholder="Default input"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <Input variant="outline" placeholder="Outline input" />
              <Input variant="filled" placeholder="Filled input" />
              <Input variant="underline" placeholder="Underline input" />
              <Input
                variant="default"
                state="error"
                placeholder="Error state"
              />
              <Input
                variant="default"
                state="success"
                placeholder="Success state"
              />
            </View>
          </Card>

          {/* LinkItem */}
          <Card variant="default">
            <View>
              <LinkItem onPress={() => console.log("Settings pressed")}>
                <Text variant="body" color="primary">
                  Settings
                </Text>
              </LinkItem>
            </View>
          </Card>

          {/* Accordion */}
          <Card variant="default">
            <Text variant="h3" className="mb-3">
              Accordion
            </Text>
            <Accordion defaultOpen={false}>
              {({ isOpen, toggle }) => (
                <>
                  <Button
                    variant="ghost"
                    onPress={toggle}
                    className="flex-row items-center justify-between w-full"
                  >
                    <Text variant="body" weight="semibold">
                      What is React Native?
                    </Text>
                    <Text variant="body">{isOpen ? "−" : "+"}</Text>
                  </Button>
                  {isOpen && (
                    <View className="pt-2 pb-4">
                      <Text variant="body" color="muted">
                        React Native is a framework for building native mobile
                        apps using React.
                      </Text>
                    </View>
                  )}
                </>
              )}
            </Accordion>
            <Accordion defaultOpen={false}>
              {({ isOpen, toggle }) => (
                <>
                  <Button
                    variant="ghost"
                    onPress={toggle}
                    className="flex-row items-center justify-between w-full"
                  >
                    <Text variant="body" weight="semibold">
                      How does NativeWind work?
                    </Text>
                    <Text variant="body">{isOpen ? "−" : "+"}</Text>
                  </Button>
                  {isOpen && (
                    <View className="pt-2 pb-4">
                      <Text variant="body" color="muted">
                        NativeWind uses Tailwind CSS to style React Native
                        components.
                      </Text>
                    </View>
                  )}
                </>
              )}
            </Accordion>
          </Card>

          {/* Modal Triggers */}
          <Card variant="default">
            <View className="gap-3">
              <Text variant="h3">Dialog Components</Text>
              <Button variant="primary" onPress={() => setModalOpen(true)}>
                <Text className="text-primary-foreground">Open Modal</Text>
              </Button>
              <Button
                variant="secondary"
                onPress={() => setBottomSheetOpen(true)}
              >
                <Text>Open Bottom Sheet</Text>
              </Button>
              <Button variant="destructive" onPress={() => setAlertOpen(true)}>
                <Text className="text-white">Open Alert Dialog</Text>
              </Button>
            </View>
          </Card>

          {/* Features */}
          <Card variant="default">
            <View className="gap-3">
              <Text variant="h3">Features</Text>
              <Text variant="body">✓ TypeScript support</Text>
              <Text variant="body">
                ✓ {isTablet ? "Tablet" : "Phone"} detected
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        contentClassName="bg-background p-6 rounded-xl gap-4"
      >
        <Text variant="h3">Success</Text>
        <Text variant="body" color="muted">
          This is a composable modal component
        </Text>
        <Button variant="primary" onPress={() => setModalOpen(false)}>
          <Text className="text-primary-foreground">Close</Text>
        </Button>
      </Modal>

      {/* Bottom Sheet */}
      <BottomSheet
        visible={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        contentClassName="p-6 gap-4"
      >
        <Text variant="h3">Select Option</Text>
        <Button
          variant="ghost"
          onPress={() => setBottomSheetOpen(false)}
          className="justify-start"
        >
          <Text variant="body">Option 1</Text>
        </Button>
        <Button
          variant="ghost"
          onPress={() => setBottomSheetOpen(false)}
          className="justify-start"
        >
          <Text variant="body">Option 2</Text>
        </Button>
        <Button
          variant="ghost"
          onPress={() => setBottomSheetOpen(false)}
          className="justify-start"
        >
          <Text variant="body">Option 3</Text>
        </Button>
      </BottomSheet>

      {/* Alert Dialog */}
      <AlertDialog
        visible={alertOpen}
        onClose={() => setAlertOpen(false)}
        contentClassName="p-6 gap-4 items-center"
      >
        <Text variant="h3">Are you sure?</Text>
        <Text variant="body" color="muted">
          This action cannot be undone
        </Text>
        <View className="flex-row gap-3 w-full">
          <Button
            variant="ghost"
            onPress={() => setAlertOpen(false)}
            className="flex-1"
          >
            <Text>Cancel</Text>
          </Button>
          <Button
            variant="destructive"
            onPress={() => setAlertOpen(false)}
            className="flex-1"
          >
            <Text className="text-white">Delete</Text>
          </Button>
        </View>
      </AlertDialog>
    </SafeAreaView>
  );
}
