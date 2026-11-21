
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase";

const ADMIN_PATH = "/akiv-base/admin/services";

type ServiceContentBlockType = "list" | "feature";
type ServiceContentBlockPosition = "left" | "right";

type ServiceContentBlockItem =
  | string
  | {
      title: string;
      description: string;
    };

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getTags(value: string) {
  return value
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function getAccent(value: string) {
  const allowed = [
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

  return allowed.includes(value) ? value : "blue";
}

function redirectWithError(message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${ADMIN_PATH}?${params.toString()}`);
}

function revalidateServices() {
  revalidatePath(ADMIN_PATH);
  revalidatePath("/");
}

function redirectWithSuccess(key: string): never {
  revalidateServices();
  redirect(
    `${ADMIN_PATH}?success=${encodeURIComponent(key)}`
  );
}

async function getNextSectionOrder(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const { data, error } = await supabase
    .from("service_sections")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.display_order ?? -1) + 1;
}

async function getNextServiceOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sectionId: string
) {
  const { data, error } = await supabase
    .from("services")
    .select("display_order")
    .eq("section_id", sectionId)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.display_order ?? -1) + 1;
}

async function getNextContentBlockOrder(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const { data, error } = await supabase
    .from("service_content_blocks")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.display_order ?? -1) + 1;
}

function getContentBlockType(value: string): ServiceContentBlockType {
  if (value === "list" || value === "feature") {
    return value;
  }

  redirectWithError("Please select a valid content block type.");
}

function getContentBlockPosition(
  value: string
): ServiceContentBlockPosition {
  if (value === "left" || value === "right") {
    return value;
  }

  return "left";
}

function getContentBlockItems(
  value: string,
  blockType: ServiceContentBlockType
): ServiceContentBlockItem[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value || "[]");
  } catch {
    redirectWithError("The content block items contain invalid JSON.");
  }

  if (!Array.isArray(parsed)) {
    redirectWithError("Content block items must be a list.");
  }

  if (blockType === "list") {
    const items = parsed
      .filter(
        (item): item is string => typeof item === "string"
      )
      .map((item) => item.trim())
      .filter(Boolean);

    if (items.length !== parsed.length) {
      redirectWithError(
        "Every list item must contain valid text."
      );
    }

    return items;
  }

  const items = parsed.map((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("title" in item) ||
      !("description" in item) ||
      typeof item.title !== "string" ||
      typeof item.description !== "string"
    ) {
      redirectWithError(
        "Every feature item must have a title and description."
      );
    }

    return {
      title: item.title.trim(),
      description: item.description.trim(),
    };
  });

  if (
    items.some(
      (item) => !item.title || !item.description
    )
  ) {
    redirectWithError(
      "Every feature item needs both a title and description."
    );
  }

  return items;
}

// =====================================================
// SERVICE SECTION ACTIONS
// =====================================================

export async function createServiceSection(formData: FormData) {
  await requireAdmin();

  const title = getText(formData, "title");
  const description = getText(formData, "description");

  if (!title) {
    redirectWithError("Please enter a section title.");
  }

  const supabase = await createClient();

  try {
    const displayOrder = await getNextSectionOrder(supabase);

    const { error } = await supabase
      .from("service_sections")
      .insert({
        title,
        description,
        display_order: displayOrder,
        is_published: false,
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Create service section failed:", error);
    redirectWithError("Unable to create the service section.");
  }

  redirectWithSuccess("sectionCreated");
}

export async function updateServiceSection(formData: FormData) {
  await requireAdmin();

  const id = getText(formData, "id");
  const title = getText(formData, "title");
  const description = getText(formData, "description");

  if (!id || !title) {
    redirectWithError("Section ID and title are required.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("service_sections")
    .update({
      title,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update service section failed:", error);
    redirectWithError("Unable to update the service section.");
  }

  redirectWithSuccess("sectionUpdated");
}

export async function toggleServiceSectionPublished(
  formData: FormData
) {
  await requireAdmin();

  const id = getText(formData, "id");

  if (!id) {
    redirectWithError("Section ID is required.");
  }

  const supabase = await createClient();

  const { data: section, error: fetchError } = await supabase
    .from("service_sections")
    .select("is_published")
    .eq("id", id)
    .single();

  if (fetchError || !section) {
    redirectWithError("Unable to find the service section.");
  }

  const { error } = await supabase
    .from("service_sections")
    .update({
      is_published: !section.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Toggle service section failed:", error);
    redirectWithError(
      "Unable to change the section publication status."
    );
  }

  redirectWithSuccess("sectionPublished");
}

export async function deleteServiceSection(formData: FormData) {
  await requireAdmin();

  const id = getText(formData, "id");

  if (!id) {
    redirectWithError("Section ID is required.");
  }

  const supabase = await createClient();

  // Prevent deletion while the section still contains services
  // or an additional content block.
  const [
    { count: serviceCount, error: serviceCountError },
    { count: contentBlockCount, error: contentBlockCountError },
  ] = await Promise.all([
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("section_id", id),
    supabase
      .from("service_content_blocks")
      .select("id", { count: "exact", head: true })
      .eq("service_section_id", id),
  ]);

  if (serviceCountError || contentBlockCountError) {
    console.error("Check service section contents failed:", {
      serviceCountError,
      contentBlockCountError,
    });

    redirectWithError(
      "Unable to verify whether this section can be deleted."
    );
  }

  if ((serviceCount ?? 0) > 0 || (contentBlockCount ?? 0) > 0) {
    redirectWithError(
      "This section cannot be deleted while it contains services or an additional content block. Delete those items first."
    );
  }

  const { data, error } = await supabase
    .from("service_sections")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Delete service section failed:", error);

    if (error.code === "23503") {
      redirectWithError(
        "This section still contains related content. Delete or move that content before deleting the section."
      );
    }

    redirectWithError("Unable to delete the service section.");
  }

  if (!data) {
    redirectWithError("The service section could not be found.");
  }

  redirectWithSuccess("sectionDeleted");
}

export async function reorderServiceSections(
  orderedIds: string[]
) {
  await requireAdmin();

  if (!Array.isArray(orderedIds)) {
    redirectWithError("Invalid section ordering.");
  }

  const supabase = await createClient();

  for (const [index, id] of orderedIds.entries()) {
    const { error } = await supabase
      .from("service_sections")
      .update({
        display_order: index,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Reorder service sections failed:", error);
      redirectWithError("Unable to save the section order.");
    }
  }

  revalidateServices();
}

// =====================================================
// SERVICE ACTIONS
// =====================================================

export async function createService(formData: FormData) {
  await requireAdmin();

  const sectionId = getText(formData, "section_id");
  const title = getText(formData, "title");
  const description = getText(formData, "description");
  const icon = getText(formData, "icon") || "Sparkles";
  const accent = getAccent(getText(formData, "accent"));
  const tags = getTags(getText(formData, "tags"));

  if (!sectionId || !title) {
    redirectWithError("A section and service title are required.");
  }

  const supabase = await createClient();

  try {
    const displayOrder = await getNextServiceOrder(
      supabase,
      sectionId
    );

    const { error } = await supabase.from("services").insert({
      section_id: sectionId,
      title,
      description,
      icon,
      accent,
      tags,
      display_order: displayOrder,
      is_published: false,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Create service failed:", error);
    redirectWithError("Unable to create the service.");
  }

  redirectWithSuccess("serviceCreated");
}

export async function updateService(formData: FormData) {
  await requireAdmin();

  const id = getText(formData, "id");
  const sectionId = getText(formData, "section_id");
  const title = getText(formData, "title");
  const description = getText(formData, "description");
  const icon = getText(formData, "icon") || "Sparkles";
  const accent = getAccent(getText(formData, "accent"));
  const tags = getTags(getText(formData, "tags"));

  if (!id || !sectionId || !title) {
    redirectWithError(
      "Service ID, section, and title are required."
    );
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .update({
      section_id: sectionId,
      title,
      description,
      icon,
      accent,
      tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update service failed:", error);
    redirectWithError("Unable to update the service.");
  }

  redirectWithSuccess("serviceUpdated");
}

export async function toggleServicePublished(formData: FormData) {
  await requireAdmin();

  const id = getText(formData, "id");

  if (!id) {
    redirectWithError("Service ID is required.");
  }

  const supabase = await createClient();

  const { data: service, error: fetchError } = await supabase
    .from("services")
    .select("is_published")
    .eq("id", id)
    .single();

  if (fetchError || !service) {
    redirectWithError("Unable to find the service.");
  }

  const { error } = await supabase
    .from("services")
    .update({
      is_published: !service.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Toggle service failed:", error);
    redirectWithError(
      "Unable to change the service publication status."
    );
  }

  redirectWithSuccess("servicePublished");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();

  const id = getText(formData, "id");

  if (!id) {
    redirectWithError("Service ID is required.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete service failed:", error);
    redirectWithError("Unable to delete the service.");
  }

  redirectWithSuccess("serviceDeleted");
}

export async function reorderServices(
  sectionId: string,
  orderedIds: string[]
) {
  await requireAdmin();

  if (!sectionId || !Array.isArray(orderedIds)) {
    redirectWithError("Invalid service ordering.");
  }

  const supabase = await createClient();

  for (const [index, id] of orderedIds.entries()) {
    const { error } = await supabase
      .from("services")
      .update({
        display_order: index,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("section_id", sectionId);

    if (error) {
      console.error("Reorder services failed:", error);
      redirectWithError("Unable to save the service order.");
    }
  }

  revalidateServices();
}

// =====================================================
// SERVICE CONTENT BLOCK ACTIONS
// =====================================================

export async function createServiceContentBlock(
  formData: FormData
) {
  await requireAdmin();

  const serviceSectionId = getText(
    formData,
    "service_section_id"
  );

  if (!serviceSectionId) {
    redirectWithError(
      "A service section must be selected for this content block."
    );
  }

  const blockType = getContentBlockType(
    getText(formData, "block_type")
  );

  const eyebrow = getText(formData, "eyebrow");
  const heading = getText(formData, "heading");
  const gradientText = getText(formData, "gradient_text");
  const itemsHeading = getText(formData, "items_heading");
  const description = getText(formData, "description");

  const items = getContentBlockItems(
    getText(formData, "items"),
    blockType
  );

  const layoutPosition = getContentBlockPosition(
    getText(formData, "layout_position")
  );

  if (!heading) {
    redirectWithError(
      "Please enter a main content block heading."
    );
  }

  if (blockType === "list" && !itemsHeading) {
    redirectWithError(
      "Please enter a heading for the list card."
    );
  }

  if (items.length === 0) {
    redirectWithError(
      "Please add at least one content block item."
    );
  }

  const supabase = await createClient();

  const { data: section, error: sectionError } = await supabase
    .from("service_sections")
    .select("id")
    .eq("id", serviceSectionId)
    .maybeSingle();

  if (sectionError) {
    console.error(
      "Validate content block service section failed:",
      sectionError
    );

    redirectWithError(
      "Unable to verify the selected service section."
    );
  }

  if (!section) {
    redirectWithError(
      "The selected service section could not be found."
    );
  }

  const {
    data: existingBlock,
    error: existingBlockError,
  } = await supabase
    .from("service_content_blocks")
    .select("id")
    .eq("service_section_id", serviceSectionId)
    .maybeSingle();

  if (existingBlockError) {
    console.error(
      "Check existing section content block failed:",
      existingBlockError
    );

    redirectWithError(
      "Unable to check whether this section already has a content block."
    );
  }

  if (existingBlock) {
    redirectWithError(
      "This section already has a content block. Edit or delete the existing block first."
    );
  }

  let displayOrder: number;

  try {
    displayOrder = await getNextContentBlockOrder(supabase);
  } catch (error) {
    console.error(
      "Get next service content block order failed:",
      error
    );

    redirectWithError(
      "Unable to determine the content block display order."
    );
  }

  const { error: insertError } = await supabase
    .from("service_content_blocks")
    .insert({
      service_section_id: serviceSectionId,
      service_id: null,
      block_type: blockType,
      eyebrow: eyebrow || null,
      heading,
      gradient_text: gradientText || null,
      items_heading: blockType === "list" ? itemsHeading : "",
      description,
      items,
      layout_position: layoutPosition,
      display_order: displayOrder,
      is_published: false,
    });

  if (insertError) {
    console.error(
      "Create service content block failed:",
      insertError
    );

    if (insertError.code === "23505") {
      redirectWithError(
        "This section already has a content block. Each section can have only one."
      );
    }

    redirectWithError(
      "Unable to create the content block. Check the server log for the database error."
    );
  }

  redirectWithSuccess("contentBlockCreated");
}

export async function updateServiceContentBlock(
  formData: FormData
) {
  await requireAdmin();

  const id = getText(formData, "id");

  const blockType = getContentBlockType(
    getText(formData, "block_type")
  );

  const eyebrow = getText(formData, "eyebrow");
  const heading = getText(formData, "heading");
  const gradientText = getText(formData, "gradient_text");
  const itemsHeading = getText(formData, "items_heading");
  const description = getText(formData, "description");

  const items = getContentBlockItems(
    getText(formData, "items"),
    blockType
  );

  const layoutPosition = getContentBlockPosition(
    getText(formData, "layout_position")
  );

  if (!id || !heading) {
    redirectWithError(
      "Content block ID and main heading are required."
    );
  }

  if (blockType === "list" && !itemsHeading) {
    redirectWithError(
      "Please enter a heading for the list card."
    );
  }

  if (items.length === 0) {
    redirectWithError(
      "Please add at least one content block item."
    );
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("service_content_blocks")
    .update({
      block_type: blockType,
      eyebrow: eyebrow || null,
      heading,
      gradient_text: gradientText || null,
      items_heading: blockType === "list" ? itemsHeading : "",
      description,
      items,
      layout_position: layoutPosition,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Update service content block failed:",
      error
    );

    redirectWithError(
      "Unable to update the content block."
    );
  }

  redirectWithSuccess("contentBlockUpdated");
}

export async function toggleServiceContentBlockPublished(
  formData: FormData
) {
  await requireAdmin();

  const id = getText(formData, "id");

  if (!id) {
    redirectWithError("Content block ID is required.");
  }

  const supabase = await createClient();

  const { data: block, error: fetchError } = await supabase
    .from("service_content_blocks")
    .select("is_published")
    .eq("id", id)
    .single();

  if (fetchError || !block) {
    redirectWithError(
      "Unable to find the content block."
    );
  }

  const { error } = await supabase
    .from("service_content_blocks")
    .update({
      is_published: !block.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Toggle service content block failed:",
      error
    );

    redirectWithError(
      "Unable to change the content block publication status."
    );
  }

  redirectWithSuccess("contentBlockPublished");
}

export async function deleteServiceContentBlock(
  formData: FormData
) {
  await requireAdmin();

  const id = getText(formData, "id");

  if (!id) {
    redirectWithError("Content block ID is required.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("service_content_blocks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Delete service content block failed:",
      error
    );

    redirectWithError(
      "Unable to delete the content block."
    );
  }

  redirectWithSuccess("contentBlockDeleted");
}

export async function reorderServiceContentBlocks(
  orderedIds: string[]
) {
  await requireAdmin();

  if (
    !Array.isArray(orderedIds) ||
    orderedIds.some(
      (id) => typeof id !== "string" || !id.trim()
    )
  ) {
    redirectWithError(
      "Invalid content block ordering."
    );
  }

  const supabase = await createClient();

  for (const [index, id] of orderedIds.entries()) {
    const { error } = await supabase
      .from("service_content_blocks")
      .update({
        display_order: index,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Reorder service content blocks failed:",
        error
      );

      redirectWithError(
        "Unable to save the content block order."
      );
    }
  }

  revalidateServices();
}
