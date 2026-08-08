export interface SlideItem {
  id: number | string;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryBtn: { text: string; href: string };
  secondaryBtn: { text: string; href: string };
  image: string;
  alt: string;
}
