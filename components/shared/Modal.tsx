import React from "react";
import {
  Modal as RNModal,
  ModalProps as RNModalProps,
  Pressable,
} from "react-native";
import { cn } from "@/lib/utils";

/**
 * Composable Modal component
 *
 * @example
 * ```tsx
 * <Modal
 *   visible={isOpen}
 *   onClose={handleClose}
 *   contentClassName="bg-background p-6 rounded-xl gap-4"
 * >
 *   <Text variant="h3">Title</Text>
 *   <Text variant="body">Content</Text>
 *   <Button onPress={handleClose}>
 *     <Text>Close</Text>
 *   </Button>
 * </Modal>
 * ```
 */

const modalVariants = {
  overlay: "flex-1 bg-black/50 items-center justify-center",
  content: "w-11/12 max-w-md",
} as const;

export interface ModalProps extends RNModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
  closeOnOverlayPress?: boolean;
}

export function Modal({
  visible,
  onClose,
  children,
  overlayClassName,
  contentClassName,
  closeOnOverlayPress = true,
  ...props
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <Pressable
        className={cn(modalVariants.overlay, overlayClassName)}
        onPress={closeOnOverlayPress ? onClose : undefined}
      >
        <Pressable
          className={cn(modalVariants.content, contentClassName)}
          onPress={(e) => e.stopPropagation()}
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
