import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const typographyVariants = cva(
  "scroll-m-20 font-semibold tracking-tight font-heading",
  {
    variants: {
      variant: {
        h1: "text-4xl font-extrabold lg:text-5xl",
        h2: "text-3xl first:mt-0",
        h3: "text-2xl",
        h4: "text-xl",
        p: "scroll-m-0 font-normal leading-7 [&:not(:first-child)]:mt-6 font-sans",
        blockquote: "mt-6 border-l-2 pl-6 italic font-sans",
      },
    },
    defaultVariants: {
      variant: "p",
    },
  },
);

interface TypographyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

export function Typography({
  className,
  as: Comp = "p",
  variant,
  ...props
}: TypographyProps) {
  return (
    <Comp
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  );
}
