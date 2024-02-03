import { MainNav } from "@/components/layout/main-nav";

import {
  BackupProgressButton,
  SyncProgressButton,
} from "@/components/progress";
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
import { redirect } from "next/navigation";
import { Icons } from "../icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { ThemeToggle } from "./theme-toggle";

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
        sticky && "sticky top-0 z-40",
        className,
      )}
    >
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />

        <div className="flex-1 flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Search />
            <ThemeToggle />
            <UserButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
function Search() {
  return (
    <>
      <form
        action={async (data: FormData) => {
          "use server";
          const q = (data.get("q") as string) ?? undefined;
          redirect(`/search?q=${q}`);
        }}
        className="relative hidden lg:block"
      >
        <Input placeholder="Search series ..." className="lg:pr-8" name="q" />
        <div className="absolute top-1/4 right-2">
          <Button
            size={"icon"}
            className="h-5 w-5"
            variant={"ghost"}
            type="submit"
          >
            <Icons.search />
          </Button>
        </div>
      </form>
      <Link href={"/search"} className="block lg:hidden">
        <Button size={"icon"} variant={"ghost"}>
          <Icons.search className="h-5 w-5" />
        </Button>
      </Link>
    </>
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
            <p className="font-medium text-sm leading-none">
              {session.user.name}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div>
            <Icons.backup className="mr-2 size-4" aria-hidden="true" />
            <BackupProgressButton>Backup Progress</BackupProgressButton>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div>
            <Icons.sync className="mr-2 size-4" aria-hidden="true" />
            <SyncProgressButton>Sync Progress</SyncProgressButton>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div>
            <Icons.logout className="mr-2 size-4" aria-hidden="true" />
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
