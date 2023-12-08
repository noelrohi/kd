import { cn } from "@/lib/utils";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { WithErrorImage } from "@/components/modified-image";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Data;
  aspectRatio?: "portrait" | "square";
  width: number;
  height: number;
  progress?: number;
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
  ...props
}: CardProps) {
  const href = data.slug ? `/drama/${data.slug}` : data.link ?? "#";
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md relative">
        <Link href={href}>
          <WithErrorImage
            src={data.image}
            alt={data.title}
            width={width}
            height={height}
            errorText={data.title}
            priority
            className={cn(
              "h-full w-full object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
          />
        </Link>
        {progress ? (
          <Progress value={progress} className="absolute -bottom-0 left-0" />
        ) : null}
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none line-clamp-5 lg:line-clamp-none">
          {data.title}
        </h3>
        <p className="text-xs text-muted-foreground">{data.description}</p>
      </div>
    </div>
  );
}
