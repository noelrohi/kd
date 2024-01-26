import { WithErrorImage } from "@/components/modified-image";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Data;
  aspectRatio?: "portrait" | "square";
  width: number;
  height: number;
  progress?: number;
  prefetch?: boolean;
}

type Data = {
  title: string;
  image: string;
  slug?: string;
  link?: string;
  description: string;
};

export function Card({
  data,
  progress,
  aspectRatio = "portrait",
  width,
  height,
  className,
  prefetch = true,
  ...props
}: CardProps) {
  const href = data.slug ? `/drama/${data.slug}` : data.link ?? "#";
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="relative overflow-hidden rounded-md">
        <Link href={href} prefetch={prefetch}>
          <WithErrorImage
            src={data.image}
            alt={data.title}
            width={width}
            height={height}
            errorText={data.title}
            priority
            className={cn(
              "h-full w-full object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
            )}
          />
        </Link>
        {progress ? (
          <Progress value={progress} className="-bottom-0 absolute left-0" />
        ) : null}
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="line-clamp-5 font-medium leading-none lg:line-clamp-none">
          {data.title}
        </h3>
        <p className="text-muted-foreground text-xs">{data.description}</p>
      </div>
    </div>
  );
}
