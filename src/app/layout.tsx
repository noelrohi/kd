import { Analytics } from "@/components/analytics";
import { ThemeProvider } from "@/components/providers/theme";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { fontHeading, fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s • ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Shadcn",
    "Radix UI",
    "Tailwind CSS",
    "Server Components",
    "Server Actions",
    "Kdrama",
    "Korean",
  ],
  authors: [
    {
      name: "gneiru",
      url: "https://github.com/gneiru",
    },
  ],
  creator: "gneiru",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@gneiru",
  },
  icons: {
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          fontHeading.variable,
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <TailwindIndicator />
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
