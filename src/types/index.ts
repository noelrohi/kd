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

interface Resp<T> {
  currentPage: number;
  hasNextPage: boolean;
  results: T;
}

/**
 * A TypeScript type alias called `Prettify`.
 * It takes a type as its argument and returns a new type that has the same properties as the original type,
 * but the properties are not intersected. This means that the new type is easier to read and understand.
 */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export interface Featured {
  id: string;
  title: string;
  image: string;
}

interface RecentResult extends Featured {
  type: "RAW" | "SUB";
  time: string;
  number: number;
}

interface SearchResult extends Featured {
  url: string;
}

export type Recent = Prettify<Resp<RecentResult[]>>;
export type TopAiring = Prettify<Resp<Featured[]>>;
export type Search = Prettify<Resp<SearchResult[]>>;
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
