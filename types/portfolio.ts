import type { ElementType } from "react";

export type PortfolioFeature = {
  icon: string;
  title: string;
  description: string;
};

export type PortfolioItem = {
  number: string;
  kind?: "App" | "Web";
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
  closing?: {
    prompt: string;
    subline: string;
    brand: string;
    tagline: string;
  };
};