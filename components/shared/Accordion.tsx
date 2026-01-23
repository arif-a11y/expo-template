import React, { useState } from "react";
import { View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

/**
 * Composable Accordion container
 *
 * @example
 * ```tsx
 * <Accordion defaultOpen>
 *   {({ isOpen, toggle }) => (
 *     <>
 *       <Pressable onPress={toggle}>
 *         <Text variant="h4">Section Title</Text>
 *       </Pressable>
 *
 *       {isOpen && (
 *         <View className="pt-3">
 *           <Text>Accordion content</Text>
 *         </View>
 *       )}
 *     </>
 *   )}
 * </Accordion>
 * ```
 */

const accordionVariants = {
  root: "border-b border-border",
} as const;

export interface AccordionProps extends Omit<ViewProps, "children"> {
  defaultOpen?: boolean;
  className?: string;
  children: (props: { isOpen: boolean; toggle: () => void }) => React.ReactNode;
}

export function Accordion({
  defaultOpen = false,
  className,
  children,
  ...props
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <View className={cn(accordionVariants.root, className)} {...props}>
      {children({ isOpen, toggle })}
    </View>
  );
}
