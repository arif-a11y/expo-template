import React from 'react';
import {
  Modal,
  ModalProps,
  View,
  Pressable,
} from 'react-native';
import { cn } from '@/lib/utils';

const bottomSheetVariants = {
  overlay: 'flex-1 bg-black/50 justify-end',
  content: 'bg-background rounded-t-3xl',
  handle: 'w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-3',
} as const;

export interface BottomSheetProps extends ModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
  showHandle?: boolean;
  closeOnOverlayPress?: boolean;
}

/**
 * Composable BottomSheet component
 *
 * @example
 * ```tsx
 * <BottomSheet
 *   visible={isOpen}
 *   onClose={handleClose}
 *   contentClassName="p-6 gap-4"
 * >
 *   <Text variant="h3">Select Option</Text>
 *   <Button onPress={handleOption1}>
 *     <Text>Option 1</Text>
 *   </Button>
 *   <Button onPress={handleOption2}>
 *     <Text>Option 2</Text>
 *   </Button>
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  visible,
  onClose,
  children,
  overlayClassName,
  contentClassName,
  showHandle = true,
  closeOnOverlayPress = true,
  ...props
}: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      {...props}
    >
      <Pressable
        className={cn(bottomSheetVariants.overlay, overlayClassName)}
        onPress={closeOnOverlayPress ? onClose : undefined}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
        >
          <View className={cn(bottomSheetVariants.content, contentClassName)}>
            {showHandle && <View className={bottomSheetVariants.handle} />}
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
