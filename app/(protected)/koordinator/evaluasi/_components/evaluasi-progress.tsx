import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface EvaluasiProgressProps {
  value: number;
  variant?: "default" | "success" | "destructive" | "warning",
  size?: "default" | "sm";
};

const colorByVariant = {
  default: "text-sky-500",
  success: "text-emerald-500",
  destructive: "text-red-500",
  warning: "text-yellow-500",
}

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
}

export const EvaluasiProgress = ({
  value,
  variant,
  size,
}: EvaluasiProgressProps) => {
  return (
    <div>
      <Progress
        className="h-2"
        value={value}
        variant={variant}
      />
      <p className={cn(
        "font-medium mt-2 text-sky-500",
        colorByVariant[variant || "default"],
        sizeByVariant[size || "default"],
      )}>
        {Math.round(value)}% Terisi
      </p>
    </div>
  )
}