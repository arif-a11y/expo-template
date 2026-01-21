import { Pressable, PressableProps } from "react-native";
import { cn } from "@/lib/utils";

const linkItemStyles = {
  base: "flex-row items-center justify-between",
  underline: "border-b-2 border-primary",
};

export interface LinkItemProps extends PressableProps {
  children: React.ReactNode;
  className?: string;
}

export function LinkItem({ children, className, ...props }: LinkItemProps) {
  return (
    <Pressable
      {...props}
      className={cn(linkItemStyles.base, linkItemStyles.underline, className)}
    >
      {children}
    </Pressable>
  );
}
