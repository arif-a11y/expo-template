import React, { useState } from "react";
import { View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export interface AccordionProps extends Omit<ViewProps, "children"> {
  className?: string;
  defaultOpen?: boolean;
}

export function Accordion({
  children,
  className,
  defaultOpen = false,
  ...props
}: AccordionProps & {
  children: (props: { isOpen: boolean; toggle: () => void }) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen(prev => !prev);

  return (
    <View className={cn("border-b border-border", className)} {...props}>
      {children({ isOpen, toggle })}
    </View>
  );
}
