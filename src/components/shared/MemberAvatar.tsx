import React from "react";

interface MemberAvatarProps {
  name: string;
  color?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

export default function MemberAvatar({ name, color, size = "md" }: MemberAvatarProps) {
  const parts = name.trim().split(" ");
  let initials = "";
  if (parts.length >= 2) {
    initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (name.length >= 2) {
    initials = name.substring(0, 2).toUpperCase();
  } else {
    initials = name.charAt(0).toUpperCase();
  }

  const bg = color || "#4f8ef7";

  return (
    <div 
      className={`${SIZE_CLASSES[size]} rounded-full flex items-center justify-center text-white font-semibold shrink-0 shadow-sm`}
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  );
}
