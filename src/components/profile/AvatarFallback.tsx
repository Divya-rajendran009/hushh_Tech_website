import React from "react";
import { cn } from "../../lib/utils";

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const iconSizeClasses = {
  sm: "[&>svg]:h-4 [&>svg]:w-4 [&>.material-symbols-outlined]:text-lg",
  md: "[&>svg]:h-5 [&>svg]:w-5 [&>.material-symbols-outlined]:text-xl",
  lg: "[&>svg]:h-8 [&>svg]:w-8 [&>.material-symbols-outlined]:text-3xl",
};

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizeClasses;
}

export function AvatarFallback({
  children,
  className,
  size = "md",
}: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full leading-none [&>*]:shrink-0 [&>svg]:block",
        sizeClasses[size],
        iconSizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
