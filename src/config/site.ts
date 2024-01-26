import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "K-Next",
  description:
    "Experience the enchanting world of Korean drama like never before with our cutting-edge app designed for true K-Drama aficionados. Dive into a captivating universe of compelling storylines, heart-fluttering romances, and breathtaking cinematography. Our app is your passport to an extensive library of the latest and classic Korean drama series, all curated to cater to your unique taste. Whether you're a seasoned K-Drama enthusiast or just beginning your journey into this mesmerizing genre, our app promises an unparalleled streaming experience. Immerse yourself in the rich storytelling, vibrant characters, and cultural allure of Korean dramas, all conveniently accessible at your fingertips. Elevate your entertainment experience – download our app today and embark on an unforgettable K-Drama adventure!",
  url: "https://kd.rohi.dev",
  links: {
    twitter: "https://twitter.com/gneiru",
    github: "https://github.com/gneiru",
  },
  mainNav: [
    {
      title: "home",
      href: "/home",
    },
    {
      title: "popular",
      href: "/popular",
    },
  ],
};

export const placeholderImage = (str: string) => {
  return `https://placehold.co/400x600/EEE/31343C?font=montserrat&text=${encodeURI(
    str,
  )}`;
};
