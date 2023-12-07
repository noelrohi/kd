import { MainNav } from "@/components/layout/main-nav";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Icons } from "../icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
            <UserButton />
          </nav>
        </div>
      </div>
    </header>
  );
}

async function UserButton() {
  const session = await auth();
  if (!session)
    return (
      <Link href={"/signin"}>
        <Button variant={"secondary"}>Sign in</Button>
      </Link>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="flex flex-row gap-2 text-foreground"
        >
          <UserAvatar
            name={session.user.name ?? "Anonymous"}
            src={session.user.image ?? ""}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div>
            <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
            <Link href={"/signout"}>Log out</Link>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserAvatar({ name, src }: { name: string; src: string }) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={`Avatar of ${name}`} />
      <AvatarFallback className="uppercase">{name.slice(0, 1)}</AvatarFallback>
    </Avatar>
  );
}
