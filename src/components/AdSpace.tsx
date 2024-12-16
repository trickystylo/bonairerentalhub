import { cn } from "@/lib/utils";

interface AdSpaceProps {
  className?: string;
  position: "top" | "sidebar" | "bottom";
}

export const AdSpace = ({ className, position }: AdSpaceProps) => {
  const positionStyles = {
    top: "w-full h-32 mb-8",
    sidebar: "w-64 h-[600px]",
    bottom: "w-full h-32 mt-8",
  };

  return (
    <div
      className={cn(
        "bg-gray-100 rounded-lg flex items-center justify-center text-gray-400",
        positionStyles[position],
        className
      )}
    >
      Advertisement Space
    </div>
  );
};