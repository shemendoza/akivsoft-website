
import type { ElementType } from "react";

export type PortfolioFeature = {
  icon: string;
  title: string;
  description: string;
};

export type PortfolioClosing = {
  prompt: string;
  subline: string;
  brand: string;
  tagline?: string;
};

export type PortfolioItem = {
  id: string;
  slug: string;
  number: string;
  kind?: "Game" | "App" | "Web";
  category?: string;
  title: string;
  image?: string;
  tagline: string;
  description: string[];
  features: PortfolioFeature[];
  genre: string;
  secondaryGenres: string[];
  platforms?: string[];
  builtWith?: string[];
  availability: string;
  icon: ElementType;
  gradient: string;
  detailsId?: string;
  closing?: PortfolioClosing;
};

export type PortfolioCategory = {
  id: string;
  name: string;
  slug: string;
  sectionTitle: string;
  sectionDescription: string;
  displayOrder: number;
  isPublished: boolean;
};

export type PortfolioCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  section_title: string;
  section_description: string;
  display_order: number;
  is_published: boolean;
};

export type PortfolioProjectRecord = {
  id: string;
  title: string;
  project_number: string | null;
  slug: string;
  image_path: string | null;
  short_description: string;
  full_details: string;
  display_order: number;
  is_published: boolean;
  category_id: string;
  image_url?: string | null;
};

export type PortfolioProjectContent = {
  kind?: "Game" | "App" | "Web";
  category?: string;
  tagline?: string;
  detailsId?: string;
  description?: string[];
  features?: PortfolioFeature[];
  genre?: string;
  secondaryGenres?: string[];
  platforms?: string[];
  builtWith?: string[];
  availability?: string;
  icon?: string;
  gradient?: string;
  closing?: PortfolioClosing;
};

export type PortfolioProjectDetailRecord = {
  project_id: string;
  content: PortfolioProjectContent;
};
