import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Nextjs Boilerplate",
  description: "Nextjs template with Shadcn-ui and Layout setted up for you!",
  url: "https://boilerplate.rohi.dev",
  links: {
    twitter: "https://twitter.com/gneiru",
    github: "https://github.com/gneiru",
  },
  mainNav: [
    {
      title: "home",
      href: "/",
    },
    {
      title: "search",
      href: "/search",
    },
    {
      title: "popular",
      href: "/popular",
    },
  ],
};

export const placeholderImage = (str: string) => {
  return `https://placehold.co/400x600/EEE/31343C?font=montserrat&text=${encodeURI(
    str
  )}`;
};
