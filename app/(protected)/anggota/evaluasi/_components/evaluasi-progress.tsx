import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface EvaluasiProgressProps {
  value: number;
  variant?: "default" | "success",
  size?: "default" | "sm";
};

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
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
        "font-medium mt-2 text-sky-700",
        colorByVariant[variant || "default"],
        sizeByVariant[size || "default"],
      )}>
        {Math.round(value)}% LKE terisi
      </p>
    </div>
  )
}