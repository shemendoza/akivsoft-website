
import { createClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export type ServiceContentBlockItem =
  | string
  | {
      title: string;
      description: string;
    };

export type ServiceContentBlockRecord = {
  id: string;
  service_section_id: string | null;
  service_id: string | null;
  block_type: "list" | "feature";
  eyebrow: string | null;
  heading: string;
  gradient_text: string | null;
  items_heading: string | null;
  description: string;
  items: ServiceContentBlockItem[];
  layout_position: "left" | "right";
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export async function getAdminServices() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: sections, error: sectionError } = await supabase
    .from("service_sections")
    .select("*")
    .order("display_order", { ascending: true });

  if (sectionError) {
    throw new Error(
      `Service sections query failed | Code: ${sectionError.code} | Message: ${sectionError.message} | Details: ${sectionError.details} | Hint: ${sectionError.hint}`
    );
  }

  const { data: services, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  if (serviceError) {
    throw new Error(
      `Services query failed | Code: ${serviceError.code} | Message: ${serviceError.message} | Details: ${serviceError.details} | Hint: ${serviceError.hint}`
    );
  }

  return {
    sections: sections ?? [],
    services: services ?? [],
  };
}

export async function getAdminServiceContentBlocks(): Promise<
  ServiceContentBlockRecord[]
> {
  await requireAdmin();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("service_content_blocks")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(
      `Service content blocks query failed | Code: ${error.code} | Message: ${error.message} | Details: ${error.details} | Hint: ${error.hint}`
    );
  }

  return (data ?? []) as ServiceContentBlockRecord[];
}
