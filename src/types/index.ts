export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: {
    twitter: string;
    github: string;
  };
  mainNav: {
    title: string;
    href: string;
  }[];
};

export interface Featured {
  id: string;
  title: string;
  image: string;
}

interface Resp<T> {
  currentPage: number;
  hasNextPage: boolean;
  results: T;
}

export interface Featured {
  id: string;
  title: string;
  image: string;
}

type RecentResult = {
  type: "RAW" | "SUB";
  time: string;
  number: number;
} & Featured;

type SearchResult = {
  url: string;
} & Featured;

export type Recent = Resp<RecentResult[]>;
export type TopAiring = Resp<Featured[]>;
export type Search = Resp<SearchResult[]>;
export type EpisodeInfo = {
  title: string;
  id: string;
  dramaId: string;
  number: number;
  downloadLink: string;
  episodes: {
    next: string | undefined;
    previous: string | undefined;
    list: { value: string; label: string }[];
  };
};
