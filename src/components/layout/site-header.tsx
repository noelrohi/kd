import { MainNav } from "@/components/layout/main-nav";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { siteConfig } from "@/config/site";

interface SiteHeaderProps extends React.ComponentPropsWithoutRef<"header"> {
  sticky?: boolean;
}

export async function SiteHeader({
  sticky = false,
  className,
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "w-full bg-background",
        sticky && "sticky top-0 z-40 ",
        className
      )}
    >
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
