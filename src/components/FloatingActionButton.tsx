
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: "default" | "accent";
  label?: string;
  position?: "bottom-right" | "bottom-center";
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  className,
  variant = "default",
  label,
  position = "bottom-right",
}) => {
  const positionClass =
    position === "bottom-right"
      ? "bottom-6 right-6"
      : "bottom-6 left-1/2 transform -translate-x-1/2";

  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed shadow-lg flex items-center gap-2 z-10",
        positionClass,
        variant === "accent" ? "bg-accent hover:bg-accent/90" : "bg-primary hover:bg-primary/90",
        className
      )}
      size="lg"
    >
      {icon}
      {label && <span>{label}</span>}
    </Button>
  );
};

export default FloatingActionButton;
