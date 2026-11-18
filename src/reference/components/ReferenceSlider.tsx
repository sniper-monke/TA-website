import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export const ReferenceSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    value={value}
    defaultValue={defaultValue}
    className={cn("relative flex min-h-11 w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#153a54]/20">
      <SliderPrimitive.Range className="absolute h-full bg-[#153a54]" />
    </SliderPrimitive.Track>
    {(value ?? defaultValue ?? [0]).map((_, index, values) => (
      <SliderPrimitive.Thumb
        key={index}
        aria-label={
          values.length === 2 ? (index === 0 ? "Minimum price" : "Maximum price") : "Value"
        }
        className="relative block h-5 w-5 rounded-full border border-[#153a54]/50 bg-[#f8f4ee] shadow after:absolute after:-inset-3 after:content-['']"
      />
    ))}
  </SliderPrimitive.Root>
));
ReferenceSlider.displayName = "ReferenceSlider";
