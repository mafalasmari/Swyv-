export type NavLink = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  links: NavLink[];
};

export type NavItem = NavLink | NavGroup;

export type FooterColumn = {
  title: string;
  links: NavLink[];
};

export type LogoAsset = {
  src: string;
  alt: string;
};

export type SocialNetwork = "linkedin" | "x" | "youtube" | "instagram";

export type SocialLink = {
  network: SocialNetwork;
  href: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const isNavGroup = (item: NavItem): item is NavGroup => "links" in item;
