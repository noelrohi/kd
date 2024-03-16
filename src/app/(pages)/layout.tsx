import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

interface StickyLayoutProps {
  children: React.ReactNode;
}

export default async function StickyLayout({ children }: StickyLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader sticky />
      <main className="flex h-full flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
