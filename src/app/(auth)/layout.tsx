import Image from "next/image";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2 md:grid-cols-3">
      <AspectRatio ratio={16 / 9}>
        <Image
          src="https://1.vikiplatform.com/c/32311c/0959bbe68a.jpg"
          alt="Trucks"
          priority
          fill
          className="absolute inset-0 h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60 md:to-background/40" />
        <Link
          href="/"
          className="absolute top-6 left-8 z-20 flex items-center font-bold text-lg tracking-tight"
        >
          <Icons.logo />
        </Link>
        <div className="absolute bottom-6 left-8 z-20 line-clamp-1 font-thin text-background text-base italic">
          &quot;We create connections&quot;
        </div>
      </AspectRatio>
      <main className="-translate-y-1/2 container absolute top-1/2 col-span-1 flex items-center md:static md:top-0 lg:col-span-1 md:col-span-2 md:flex md:translate-y-0">
        {children}
      </main>
    </div>
  );
}
