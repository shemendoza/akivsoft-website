
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase";

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function redirectWithError(message: string): never {
  redirect(`/akiv-base/admin/portfolio?error=${encodeURIComponent(message)}`);
}

function revalidatePortfolio() {
  revalidatePath("/akiv-base/admin/portfolio");
  revalidatePath("/");
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeProjectContent(
  value: Record<string, unknown>,
  slug: string
): Record<string, unknown> {
  const content = { ...value };

  content.detailsId = `${slug}-details`;

  if (
    typeof content.closing === "object" &&
    content.closing !== null &&
    !Array.isArray(content.closing)
  ) {
    const closing = {
      ...(content.closing as Record<string, unknown>),
    };

    delete closing.tagline;

    content.closing = closing;
  }

  return content;
}

function parseProjectContent(
  value: string
): Record<string, unknown> | null {
  try {
    const parsed: unknown = value ? JSON.parse(value) : {};

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function formatProjectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

/**
 * Recalculates project display order and project numbers
 * within one category.
 *
 * The existing display order is preserved. Project IDs provide
 * deterministic ordering when two projects have the same order.
 */
async function synchronizeCategoryProjects(
  supabase: Awaited<ReturnType<typeof createClient>>,
  categoryId: string
): Promise<boolean> {
  const { data: projects, error: fetchError } = await supabase
    .from("portfolio_projects")
    .select("id, display_order")
    .eq("category_id", categoryId)
    .order("display_order", { ascending: true })
    .order("id", { ascending: true });

  if (fetchError || !projects) {
    console.error(
      "Unable to retrieve projects for category synchronization:",
      fetchError
    );

    return false;
  }

  for (let index = 0; index < projects.length; index++) {
    const project = projects[index];

    const { data, error } = await supabase
      .from("portfolio_projects")
      .update({
        display_order: index + 1,
        project_number: formatProjectNumber(index),
      })
      .eq("id", project.id)
      .eq("category_id", categoryId)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      console.error(
        "Unable to synchronize portfolio project numbering:",
        error
      );

      return false;
    }
  }

  return true;
}

async function getNextProjectOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  categoryId: string
): Promise<number | null> {
  const { data: projects, error } = await supabase
    .from("portfolio_projects")
    .select("id")
    .eq("category_id", categoryId);

  if (error || !projects) {
    console.error(
      "Unable to retrieve destination category projects:",
      error
    );

    return null;
  }

  return projects.length + 1;
}

function validateProjectImage(image: File): string | null {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(image.type)) {
    return "Only JPEG, PNG, and WebP images are allowed.";
  }

  if (image.size > 10 * 1024 * 1024) {
    return "Image must not exceed 10MB.";
  }

  return null;
}

function getImageExtension(image: File) {
  return image.type === "image/jpeg"
    ? "jpg"
    : image.type === "image/png"
      ? "png"
      : "webp";
}

export async function createPortfolioProject(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const title = getText(formData, "title");
  const slug = normalizeSlug(title);
  const categoryId = getText(formData, "category_id");
  const shortDescription = getText(formData, "short_description");
  const contentValue = getText(formData, "content");

  if (!title || !slug || !categoryId || !shortDescription) {
    redirectWithError("Please complete all required project fields.");
  }

  const parsedContent = parseProjectContent(contentValue);

  if (!parsedContent) {
    redirectWithError("Invalid project details format.");
  }

  const content = normalizeProjectContent(parsedContent, slug);

  const { data: category, error: categoryError } = await supabase
    .from("portfolio_categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (categoryError || !category) {
    redirectWithError("Please select a valid category.");
  }

  const displayOrder = await getNextProjectOrder(supabase, categoryId);

  if (displayOrder === null) {
    redirectWithError("Unable to determine the new project order.");
  }

  const image = formData.get("image");
  let imagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const imageError = validateProjectImage(image);

    if (imageError) {
      redirectWithError(imageError);
    }

    imagePath = `${crypto.randomUUID()}.${getImageExtension(image)}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(imagePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Portfolio image upload failed:", uploadError);
      redirectWithError("Unable to upload project image.");
    }
  }

  const { data: project, error: projectError } = await supabase
    .from("portfolio_projects")
    .insert({
      title,
      slug,
      project_number: formatProjectNumber(displayOrder - 1),
      category_id: categoryId,
      image_path: imagePath,
      short_description: shortDescription,
      full_details: "",
      display_order: displayOrder,
      is_published: false,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    if (imagePath) {
      await supabase.storage.from("portfolio-images").remove([imagePath]);
    }

    if (projectError?.code === "23505") {
      redirectWithError(
        "A project with this title or URL slug already exists. Please use a different title."
      );
    }

    console.error("Portfolio project creation failed:", projectError);
    redirectWithError("Unable to create portfolio project.");
  }

  const { error: detailsError } = await supabase
    .from("portfolio_project_details")
    .insert({
      project_id: project.id,
      content,
    });

  if (detailsError) {
    await supabase
      .from("portfolio_projects")
      .delete()
      .eq("id", project.id);

    if (imagePath) {
      await supabase.storage.from("portfolio-images").remove([imagePath]);
    }

    console.error("Portfolio project details creation failed:", detailsError);
    redirectWithError("Unable to save project details.");
  }

  const synchronized = await synchronizeCategoryProjects(
    supabase,
    categoryId
  );

  if (!synchronized) {
    console.error(
      "The project was created, but its category numbering could not be synchronized."
    );
  }

  revalidatePortfolio();
  redirect("/akiv-base/admin/portfolio?created=1");
}

export async function createPortfolioCategory(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const name = getText(formData, "name");
  const slug = normalizeSlug(name);
  const sectionDescription = getText(formData, "section_description");

  if (!name || !slug || !sectionDescription) {
    redirectWithError("Please complete all required category fields.");
  }

  const { count, error: countError } = await supabase
    .from("portfolio_categories")
    .select("id", { count: "exact", head: true });

  if (countError || count === null) {
    console.error("Unable to determine the next category order:", countError);
    redirectWithError("Unable to determine the new category order.");
  }

  const displayOrder = count + 1;

  const { error } = await supabase.from("portfolio_categories").insert({
    name,
    slug,
    section_title: name,
    section_description: sectionDescription,
    display_order: displayOrder,
    is_published: false,
  });

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        "That category URL slug is already in use. Please use a different category name."
      );
    }

   console.error("Portfolio category creation failed:", {
  code: error.code,
  message: error.message,
  details: error.details,
  hint: error.hint,
});
    redirectWithError("Unable to create portfolio category.");
  }

  revalidatePortfolio();
  redirect("/akiv-base/admin/portfolio?categoryCreated=1");
}

export async function updatePortfolioCategory(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const id = getText(formData, "id");
  const name = getText(formData, "name");
  const slug = normalizeSlug(name);
  const sectionDescription = getText(formData, "section_description");

  if (!id || !name || !slug || !sectionDescription) {
    redirectWithError("Please complete all required category fields.");
  }

  const { data, error } = await supabase
    .from("portfolio_categories")
    .update({
      name,
      slug,
      section_title: name,
      section_description: sectionDescription,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        "That category URL slug is already in use. Please use a different category name."
      );
    }

    console.error("Portfolio category update failed:", error);
    redirectWithError("Unable to update portfolio category.");
  }

  if (!data) {
    redirectWithError("The category could not be found.");
  }

  revalidatePortfolio();
  redirect("/akiv-base/admin/portfolio?categoryUpdated=1");
}

export async function togglePortfolioCategoryPublished(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const id = getText(formData, "id");
  const publishedValue = getText(formData, "is_published");

  if (!id || !["true", "false"].includes(publishedValue)) {
    redirectWithError("Invalid category publication request.");
  }

  const isPublished = publishedValue === "true";

  const { data, error } = await supabase
    .from("portfolio_categories")
    .update({ is_published: isPublished })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Portfolio category publication update failed:", error);
    redirectWithError("Unable to change category publication status.");
  }

  if (!data) {
    redirectWithError("The category could not be found.");
  }

  revalidatePortfolio();
  redirect("/akiv-base/admin/portfolio?categoryPublished=1");
}

export async function deletePortfolioCategory(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();
  const id = getText(formData, "id");

  if (!id) {
    redirectWithError("Invalid category.");
  }

  const { count, error: projectCheckError } = await supabase
    .from("portfolio_projects")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (projectCheckError) {
    redirectWithError(
      "Unable to check projects assigned to this category."
    );
  }

  if ((count ?? 0) > 0) {
    redirectWithError(
      "This category still contains projects. Move or delete those projects before deleting the category."
    );
  }

  const { error: deleteError } = await supabase
    .from("portfolio_categories")
    .delete()
    .eq("id", id);

  if (deleteError) {
    if (deleteError.code === "23503") {
      redirectWithError(
        "This category still has projects assigned to it and cannot be deleted."
      );
    }
console.error("Portfolio category deletion failed:", {
  code: deleteError.code,
  message: deleteError.message,
  details: deleteError.details,
  hint: deleteError.hint,
});
    redirectWithError("Unable to delete portfolio category.");
  }

  revalidatePortfolio();
  redirect("/akiv-base/admin/portfolio?categoryDeleted=1");
}

export async function updatePortfolioProject(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const id = getText(formData, "id");
  const title = getText(formData, "title");
  const slug = normalizeSlug(title);
  const categoryId = getText(formData, "category_id");
  const shortDescription = getText(formData, "short_description");
  const contentValue = getText(formData, "content");
  const removeImage = getText(formData, "remove_image") === "true";

  if (!id || !title || !slug || !categoryId || !shortDescription) {
    redirectWithError("Please complete all required project fields.");
  }

  const parsedContent = parseProjectContent(contentValue);

  if (!parsedContent) {
    redirectWithError("Invalid project details format.");
  }

  const content = normalizeProjectContent(parsedContent, slug);

  const { data: existingProject, error: existingError } = await supabase
    .from("portfolio_projects")
    .select("id, image_path, category_id")
    .eq("id", id)
    .maybeSingle();

  if (existingError || !existingProject) {
    redirectWithError("The project could not be found.");
  }

  const { data: category, error: categoryError } = await supabase
    .from("portfolio_categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (categoryError || !category) {
    redirectWithError("Please select a valid category.");
  }

  const categoryChanged = existingProject.category_id !== categoryId;

  let displayOrder: number | null = null;

  if (categoryChanged) {
    displayOrder = await getNextProjectOrder(supabase, categoryId);

    if (displayOrder === null) {
      redirectWithError("Unable to determine the destination project order.");
    }
  }

  const image = formData.get("image");
  let newImagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const imageError = validateProjectImage(image);

    if (imageError) {
      redirectWithError(imageError);
    }

    newImagePath = `${crypto.randomUUID()}.${getImageExtension(image)}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(newImagePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Portfolio replacement image upload failed:", uploadError);
      redirectWithError("Unable to upload replacement project image.");
    }
  }

  const imagePath = newImagePath
    ? newImagePath
    : removeImage
      ? null
      : existingProject.image_path;

  const updateValues: Record<string, unknown> = {
    title,
    slug,
    category_id: categoryId,
    image_path: imagePath,
    short_description: shortDescription,
  };

  if (categoryChanged && displayOrder !== null) {
    updateValues.display_order = displayOrder;
  }

  const { error: updateError } = await supabase
    .from("portfolio_projects")
    .update(updateValues)
    .eq("id", id);

  if (updateError) {
    if (newImagePath) {
      await supabase.storage.from("portfolio-images").remove([newImagePath]);
    }

    if (updateError.code === "23505") {
      redirectWithError("That project URL slug is already in use.");
    }

    console.error("Portfolio project update failed:", updateError);
    redirectWithError("Unable to update portfolio project.");
  }

  const { error: detailsError } = await supabase
    .from("portfolio_project_details")
    .upsert(
      {
        project_id: id,
        content,
      },
      { onConflict: "project_id" }
    );

  if (detailsError) {
    console.error("Portfolio project details update failed:", detailsError);
    redirectWithError(
      "Project information was updated, but its display content could not be saved."
    );
  }

  if (existingProject.image_path && (newImagePath || removeImage)) {
    const { error: imageRemovalError } = await supabase.storage
      .from("portfolio-images")
      .remove([existingProject.image_path]);

    if (imageRemovalError) {
      console.error(
        "Unable to remove the previous portfolio image:",
        imageRemovalError
      );
    }
  }

  if (categoryChanged) {
    const sourceSynchronized = await synchronizeCategoryProjects(
      supabase,
      existingProject.category_id
    );

    if (!sourceSynchronized) {
      console.error(
        "Unable to synchronize project numbering in the source category."
      );
    }
  }

  const destinationSynchronized = await synchronizeCategoryProjects(
    supabase,
    categoryId
  );

  if (!destinationSynchronized) {
    console.error(
      "Unable to synchronize project numbering in the destination category."
    );
  }

  revalidatePortfolio();
  redirect("/akiv-base/admin/portfolio?projectUpdated=1");
}

export async function togglePortfolioProjectPublished(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const id = getText(formData, "id");
  const publishedValue = getText(formData, "is_published");

  if (!id || !["true", "false"].includes(publishedValue)) {
    redirectWithError("Invalid project publication request.");
  }

  const { data, error } = await supabase
    .from("portfolio_projects")
    .update({ is_published: publishedValue === "true" })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Portfolio project publication update failed:", error);
    redirectWithError("Unable to change project publication status.");
  }

  if (!data) {
    redirectWithError("The project could not be found.");
  }

  revalidatePortfolio();
  redirect("/akiv-base/admin/portfolio?projectPublished=1");
}

export async function deletePortfolioProject(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const id = getText(formData, "id");

  if (!id) {
    redirectWithError("Invalid project.");
  }

  const { data: project, error: projectError } = await supabase
    .from("portfolio_projects")
    .select("id, image_path, category_id")
    .eq("id", id)
    .maybeSingle();

  if (projectError || !project) {
    redirectWithError("The project could not be found.");
  }

  const { error: detailsError } = await supabase
    .from("portfolio_project_details")
    .delete()
    .eq("project_id", id);

  if (detailsError) {
    console.error("Portfolio project details deletion failed:", detailsError);
    redirectWithError("Unable to delete the project's detail records.");
  }

  const { error: deleteError } = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Portfolio project deletion failed:", deleteError);
    redirectWithError("Unable to delete portfolio project.");
  }

  if (project.image_path) {
    const { error: imageError } = await supabase.storage
      .from("portfolio-images")
      .remove([project.image_path]);

    if (imageError) {
      console.error("Portfolio project image deletion failed:", imageError);
    }
  }

  const synchronized = await synchronizeCategoryProjects(
    supabase,
    project.category_id
  );

  if (!synchronized) {
    console.error(
      "Unable to synchronize project numbering after project deletion."
    );
  }

  revalidatePortfolio();
  redirect("/akiv-base/admin/portfolio?projectDeleted=1");
}

export async function reorderPortfolioProjects(
  categoryId: string,
  projectIds: string[]
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  if (
    !categoryId?.trim() ||
    !Array.isArray(projectIds) ||
    projectIds.some((id) => typeof id !== "string" || !id.trim())
  ) {
    return {
      success: false,
      error: "Invalid project order.",
    };
  }

  const uniqueIds = [...new Set(projectIds)];

  if (uniqueIds.length !== projectIds.length) {
    return {
      success: false,
      error: "The project order contains duplicate entries.",
    };
  }

  const supabase = await createClient();

  const { data: currentProjects, error: fetchError } = await supabase
    .from("portfolio_projects")
    .select("id, display_order, project_number")
    .eq("category_id", categoryId)
    .order("display_order", { ascending: true })
    .order("id", { ascending: true });

  if (fetchError || !currentProjects) {
    console.error("Unable to retrieve portfolio project order:", fetchError);

    return {
      success: false,
      error: "Unable to retrieve the current project order.",
    };
  }

  const currentIds = new Set(
    currentProjects.map((project) => project.id)
  );

  if (
    uniqueIds.length !== currentProjects.length ||
    uniqueIds.some((id) => !currentIds.has(id))
  ) {
    return {
      success: false,
      error: "The project list has changed. Refresh and try again.",
    };
  }

  const unchanged = uniqueIds.every(
    (id, index) => id === currentProjects[index]?.id
  );

  if (unchanged) {
    return { success: true };
  }

  for (let index = 0; index < uniqueIds.length; index++) {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .update({
        display_order: index + 1,
        project_number: formatProjectNumber(index),
      })
      .eq("id", uniqueIds[index])
      .eq("category_id", categoryId)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      console.error("Unable to reorder portfolio projects:", error);

      for (const original of currentProjects) {
        const { error: rollbackError } = await supabase
          .from("portfolio_projects")
          .update({
            display_order: original.display_order,
            project_number: original.project_number,
          })
          .eq("id", original.id)
          .eq("category_id", categoryId);

        if (rollbackError) {
          console.error(
            "Unable to restore portfolio project order:",
            rollbackError
          );
        }
      }

      return {
        success: false,
        error: "Unable to save the new project order. Please try again.",
      };
    }
  }

  revalidatePortfolio();

  return { success: true };
}

/**
 * Reorders portfolio categories.
 * The submitted IDs must match every existing category exactly once.
 * Project records and their category assignments are not modified.
 */
export async function reorderPortfolioCategories(
  categoryIds: string[]
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  if (
    !Array.isArray(categoryIds) ||
    categoryIds.some(
      (id) => typeof id !== "string" || !id.trim()
    )
  ) {
    return {
      success: false,
      error: "Invalid category order.",
    };
  }

  const uniqueIds = [...new Set(categoryIds)];

  if (uniqueIds.length !== categoryIds.length) {
    return {
      success: false,
      error: "The category order contains duplicate entries.",
    };
  }

  const supabase = await createClient();

  const { data: currentCategories, error: fetchError } = await supabase
    .from("portfolio_categories")
    .select("id, display_order")
    .order("display_order", { ascending: true })
    .order("id", { ascending: true });

  if (fetchError || !currentCategories) {
    console.error("Unable to retrieve portfolio category order:", fetchError);

    return {
      success: false,
      error: "Unable to retrieve the current category order.",
    };
  }

  const currentIds = new Set(
    currentCategories.map((category) => category.id)
  );

  if (
    uniqueIds.length !== currentCategories.length ||
    uniqueIds.some((id) => !currentIds.has(id))
  ) {
    return {
      success: false,
      error: "The category list has changed. Refresh and try again.",
    };
  }

  const unchanged = uniqueIds.every(
    (id, index) => id === currentCategories[index]?.id
  );

  if (unchanged) {
    return { success: true };
  }

  for (let index = 0; index < uniqueIds.length; index++) {
    const { data, error } = await supabase
      .from("portfolio_categories")
      .update({
        display_order: index + 1,
      })
      .eq("id", uniqueIds[index])
      .select("id")
      .maybeSingle();

    if (error || !data) {
      console.error("Unable to reorder portfolio categories:", error);

      for (const original of currentCategories) {
        const { error: rollbackError } = await supabase
          .from("portfolio_categories")
          .update({
            display_order: original.display_order,
          })
          .eq("id", original.id);

        if (rollbackError) {
          console.error(
            "Unable to restore portfolio category order:",
            rollbackError
          );
        }
      }

      return {
        success: false,
        error: "Unable to save the new category order. Please try again.",
      };
    }
  }

  revalidatePortfolio();

  return { success: true };
}
