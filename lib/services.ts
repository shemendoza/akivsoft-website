
import { createClient } from "@/lib/supabase";
import type {
  PublicService,
  PublicServiceSection,
  ServiceAccent,
  ServiceIconName,
  ServiceRecord,
  ServiceSectionRecord,
} from "@/types/services";

export type PublicServiceContentBlockItem =
  | string
  | {
      title: string;
      description: string;
    };

export type PublicServiceContentBlock = {
  id: string;
  service_id: string | null;
  service_section_id: string | null;
  block_type: "list" | "feature";
  eyebrow: string | null;
  heading: string;
  gradient_text: string | null;
  items_heading: string | null;
  description: string;
  items: PublicServiceContentBlockItem[];
  layout_position: "left" | "right";
  display_order: number;
};

const validIcons: ServiceIconName[] = [
  "Gamepad2",
  "Lightbulb",
  "Gauge",
  "Rocket",
  "Smartphone",
  "Globe",
  "Sparkles",
  "Code2",
  "Braces",
  "Terminal",
  "Monitor",
  "Laptop",
  "Layers",
  "Palette",
  "PenTool",
  "Activity",
  "Blocks",
  "Box",
  "Bug",
  "Cloud",
  "Cpu",
  "Database",
  "FileCode2",
  "Fingerprint",
  "GitBranch",
  "HardDrive",
  "Joystick",
  "LayoutDashboard",
  "MousePointer2",
  "Network",
  "Puzzle",
  "ShieldCheck",
  "ShoppingCart",
  "SlidersHorizontal",
  "Target",
  "Workflow",
  "Wrench",
  "Zap",
  "Camera",
  "Image",
  "Music",
  "Video",
  "Wifi",
  "Server",
  "Lock",
];

const validAccents: ServiceAccent[] = [
  "blue",
  "purple",
  "cyan",
  "pink",
  "orange",
  "gold",
  "red",
  "green",
  "teal",
  "indigo",
  "violet",
  "rose",
];

function getServiceIcon(icon: string): ServiceIconName {
  return validIcons.includes(icon as ServiceIconName)
    ? (icon as ServiceIconName)
    : "Sparkles";
}

function getServiceAccent(accent: string): ServiceAccent {
  return validAccents.includes(accent as ServiceAccent)
    ? (accent as ServiceAccent)
    : "blue";
}

export async function getPublicServices(): Promise<
  PublicServiceSection[]
> {
  const supabase = await createClient();

  const { data: sections, error: sectionError } = await supabase
    .from("service_sections")
    .select(
      "id, title, description, display_order, is_published, created_at, updated_at"
    )
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (sectionError) {
    throw new Error(
      `Public service sections query failed: ${sectionError.message}`
    );
  }

  const publishedSections =
    (sections ?? []) as ServiceSectionRecord[];

  if (publishedSections.length === 0) {
    return [];
  }

  const sectionIds = publishedSections.map((section) => section.id);

  const { data: services, error: serviceError } = await supabase
    .from("services")
    .select(
      "id, section_id, title, description, icon, accent, tags, display_order, is_published, created_at, updated_at"
    )
    .in("section_id", sectionIds)
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (serviceError) {
    throw new Error(
      `Public services query failed: ${serviceError.message}`
    );
  }

  const publishedServices = (services ?? []) as ServiceRecord[];

  return publishedSections.map((section) => {
    const sectionServices = publishedServices
      .filter((service) => service.section_id === section.id)
      .map((service, index): PublicService => ({
        id: service.id,
        number: String(index + 1).padStart(2, "0"),
        title: service.title,
        description: service.description,
        tags: service.tags ?? [],
        icon: getServiceIcon(service.icon),
        accent: getServiceAccent(service.accent),
      }));

    return {
      id: section.id,
      title: section.title,
      description: section.description,
      services: sectionServices,
    };
  });
}

export async function getPublicServiceContentBlocks(): Promise<
  PublicServiceContentBlock[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("service_content_blocks")
    .select(
      "id, service_id, service_section_id, block_type, eyebrow, heading, gradient_text, items_heading, description, items, layout_position, display_order"
    )
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(
      `Public service content blocks query failed: ${error.message}`
    );
  }

  return (data ?? []).map((block) => {
    const items = Array.isArray(block.items)
      ? block.items
      : [];

    const normalizedItems: PublicServiceContentBlockItem[] =
      block.block_type === "list"
        ? items.filter(
            (item): item is string => typeof item === "string"
          )
        : items.filter(
            (
              item
            ): item is { title: string; description: string } =>
              typeof item === "object" &&
              item !== null &&
              !Array.isArray(item) &&
              typeof item.title === "string" &&
              typeof item.description === "string"
          );

    return {
      id: block.id,
      service_id: block.service_id ?? null,
      service_section_id: block.service_section_id ?? null,
      block_type: block.block_type as "list" | "feature",
      eyebrow: block.eyebrow,
      heading: block.heading,
      gradient_text: block.gradient_text ?? null,
      items_heading: block.items_heading ?? null,
      description: block.description ?? "",
      items: normalizedItems,
      layout_position: block.layout_position as "left" | "right",
      display_order: block.display_order,
    };
  });
}
