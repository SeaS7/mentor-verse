import React from "react";
import { cn } from "@/lib/utils";

const Skeleton = ({ className }: { className?: string }) => {
  return <div className={cn("animate-pulse bg-gray-300 dark:bg-gray-700 rounded", className)} />;
};

export default Skeleton;
