import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "~/lib";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  wide?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, wide = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full mx-auto px-6",
          wide ? "max-w-[--max-width-wide]" : "max-w-[--max-width]",
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

export { Container };
