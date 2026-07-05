export type LocaleKey = "zh-Hant-TW" | "en";
export type I18nString = Record<LocaleKey, string>;
export type I18nStringArray = Record<LocaleKey, string[]>;

export interface MediaItem {
  src: string;
  figcaption: string;
}
export type I18nMediaArray = Record<LocaleKey, MediaItem[]>;

export interface LinkItem {
  title: string;
  link: string;
}
export type I18nLinkArray = Record<LocaleKey, LinkItem[]>;

export interface VideoItem {
  src: string;
  title: string;
  description: string;
  thumbnail_loc: string;
}
export type I18nVideoArray = Record<LocaleKey, VideoItem[]>;

export interface YearRange {
  start: number;
  end: number | null;
}

export interface Product {
  id: number;
  slug: string;
  clickable: boolean;
  schemaImage: I18nMediaArray;
  heroImage: I18nMediaArray;
  name: I18nString;
  intro: I18nString;
  keywords: I18nStringArray;
  summary?: I18nString;
  platform: string[];
  yearRange: YearRange;
  target?: I18nStringArray;
  roles: I18nStringArray;
  tools?: I18nStringArray;
  observe?: I18nStringArray;
  learn?: I18nStringArray;
  research?: I18nStringArray;
  output?: I18nStringArray;
  images?: I18nMediaArray;
  videos?: I18nVideoArray;
  relatedLinks?: I18nLinkArray;
  updatedAt?: string;
}

export interface Project {
  id: number;
  slug: string;
  clickable: boolean;
  name: I18nString;
  intro?: I18nString;
  platform: string[];
  yearRange: YearRange;
  roles: I18nStringArray;
  link?: string;
  heroImage?: I18nMediaArray;
}
