import React from 'react';
import {
  Modal,
  ModalProps,
  View,
  Pressable,
} from 'react-native';
import { cn } from '@/lib/utils';

const alertDialogVariants = {
  overlay: 'flex-1 bg-black/60 items-center justify-center',
  content: 'bg-background rounded-2xl w-11/12 max-w-sm',
} as const;

export interface AlertDialogProps extends ModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
}

/**
 * Composable AlertDialog component
 * Use for confirmations, warnings, destructive actions
 *
 * @example
 * ```tsx
 * <AlertDialog
 *   visible={isOpen}
 *   onClose={handleClose}
 *   contentClassName="p-6 gap-4"
 * >
 *   <Icon size="xl" className="text-destructive">
 *     <WarningIcon />
 *   </Icon>
 *   <Text variant="h3" align="center">Delete Account?</Text>
 *   <Text variant="body" align="center" color="muted">
 *     This action cannot be undone
 *   </Text>
 *   <View className="flex-row gap-3">
 *     <Button variant="ghost" onPress={handleClose} className="flex-1">
 *       <Text>Cancel</Text>
 *     </Button>
 *     <Button variant="destructive" onPress={handleDelete} className="flex-1">
 *       <Text>Delete</Text>
 *     </Button>
 *   </View>
 * </AlertDialog>
 * ```
 */
export function AlertDialog({
  visible,
  onClose,
  children,
  overlayClassName,
  contentClassName,
  ...props
}: AlertDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <View className={cn(alertDialogVariants.overlay, overlayClassName)}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
        >
          <View className={cn(alertDialogVariants.content, contentClassName)}>
            {children}
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}
