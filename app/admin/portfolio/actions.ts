
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
  redirect(`/admin/portfolio?error=${encodeURIComponent(message)}`);
}

function revalidatePortfolio() {
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createPortfolioProject(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const title = getText(formData, "title");
  const slug = getText(formData, "slug");
  const projectNumber = getText(formData, "project_number");
  const categoryId = getText(formData, "category_id");
  const shortDescription = getText(formData, "short_description");
  const fullDetails = getText(formData, "full_details");
  const displayOrderValue = getText(formData, "display_order");
  const contentValue = getText(formData, "content");

  if (!title || !slug || !categoryId || !shortDescription) {
    redirectWithError("Please complete all required project fields.");
  }

  const displayOrder = Number.parseInt(displayOrderValue, 10);

  if (!Number.isInteger(displayOrder) || displayOrder < 0) {
    redirectWithError("Invalid project display order.");
  }

  let content = {};

  try {
    content = contentValue ? JSON.parse(contentValue) : {};
  } catch {
    redirectWithError("Invalid project details format.");
  }

  const { data: category, error: categoryError } = await supabase
    .from("portfolio_categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (categoryError || !category) {
    redirectWithError("Please select a valid category.");
  }

  const image = formData.get("image");
  let imagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(image.type)) {
      redirectWithError("Only JPEG, PNG, and WebP images are allowed.");
    }

    if (image.size > 10 * 1024 * 1024) {
      redirectWithError("Image must not exceed 10MB.");
    }

    const extension =
      image.type === "image/jpeg"
        ? "jpg"
        : image.type === "image/png"
          ? "png"
          : "webp";

    imagePath = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(imagePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      redirectWithError("Unable to upload project image.");
    }
  }

  const { data: project, error: projectError } = await supabase
    .from("portfolio_projects")
    .insert({
      title,
      slug,
      project_number: projectNumber || null,
      category_id: categoryId,
      image_path: imagePath,
      short_description: shortDescription,
      full_details: fullDetails,
      display_order: displayOrder,
      is_published: false,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    if (imagePath) {
      await supabase.storage.from("portfolio-images").remove([imagePath]);
    }

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

    redirectWithError("Unable to save project details.");
  }

  revalidatePortfolio();
  redirect("/admin/portfolio?created=1");
}

export async function createPortfolioCategory(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const name = getText(formData, "name");
  const slug = normalizeSlug(getText(formData, "slug"));
  const sectionTitle = getText(formData, "section_title");
  const sectionDescription = getText(formData, "section_description");
  const displayOrderValue = getText(formData, "display_order");

  if (!name || !slug || !sectionTitle || !sectionDescription) {
    redirectWithError("Please complete all required category fields.");
  }

  const displayOrder = Number(displayOrderValue);

  if (!Number.isInteger(displayOrder) || displayOrder < 0) {
    redirectWithError("Category display order must be a whole number of zero or greater.");
  }

  const { error } = await supabase.from("portfolio_categories").insert({
    name,
    slug,
    section_title: sectionTitle,
    section_description: sectionDescription,
    display_order: displayOrder,
    is_published: false,
  });

  if (error) {
    if (error.code === "23505") {
      redirectWithError("That category URL slug is already in use. Please choose another.");
    }

    redirectWithError("Unable to create portfolio category.");
  }

  revalidatePortfolio();
  redirect("/admin/portfolio?categoryCreated=1");
}

export async function updatePortfolioCategory(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const id = getText(formData, "id");
  const name = getText(formData, "name");
  const slug = normalizeSlug(getText(formData, "slug"));
  const sectionTitle = getText(formData, "section_title");
  const sectionDescription = getText(formData, "section_description");
  const displayOrderValue = getText(formData, "display_order");

  if (!id || !name || !slug || !sectionTitle || !sectionDescription) {
    redirectWithError("Please complete all required category fields.");
  }

  const displayOrder = Number(displayOrderValue);

  if (!Number.isInteger(displayOrder) || displayOrder < 0) {
    redirectWithError("Category display order must be a whole number of zero or greater.");
  }

  const { data, error } = await supabase
    .from("portfolio_categories")
    .update({
      name,
      slug,
      section_title: sectionTitle,
      section_description: sectionDescription,
      display_order: displayOrder,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      redirectWithError("That category URL slug is already in use. Please choose another.");
    }

    redirectWithError("Unable to update portfolio category.");
  }

  if (!data) {
    redirectWithError("The category could not be found.");
  }

  revalidatePortfolio();
  redirect("/admin/portfolio?categoryUpdated=1");
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
  redirect("/admin/portfolio?categoryPublished=1");
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
    redirectWithError("Unable to check projects assigned to this category.");
  }

  if ((count ?? 0) > 0) {
    redirectWithError("This category still contains projects. Move or delete those projects before deleting the category.");
  }

  const { error: deleteError } = await supabase
    .from("portfolio_categories")
    .delete()
    .eq("id", id);

  if (deleteError) {
    if (deleteError.code === "23503") {
      redirectWithError("This category still has projects assigned to it and cannot be deleted.");
    }

    redirectWithError("Unable to delete portfolio category.");
  }

  revalidatePortfolio();
  redirect("/admin/portfolio?categoryDeleted=1");
}

export async function updatePortfolioProject(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const id = getText(formData, "id");
  const title = getText(formData, "title");
  const slug = getText(formData, "slug");
  const projectNumber = getText(formData, "project_number");
  const categoryId = getText(formData, "category_id");
  const shortDescription = getText(formData, "short_description");
  const fullDetails = getText(formData, "full_details");
  const displayOrderValue = getText(formData, "display_order");
  const contentValue = getText(formData, "content");
  const removeImage = getText(formData, "remove_image") === "true";

  if (!id || !title || !slug || !categoryId || !shortDescription) {
    redirectWithError("Please complete all required project fields.");
  }

  const displayOrder = Number(displayOrderValue);

  if (!Number.isInteger(displayOrder) || displayOrder < 0) {
    redirectWithError("Project display order must be a whole number of zero or greater.");
  }

  let content: Record<string, unknown>;

  try {
    const parsed: unknown = contentValue ? JSON.parse(contentValue) : {};

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      redirectWithError("Invalid project details format.");
    }

    content = parsed as Record<string, unknown>;
  } catch {
    redirectWithError("Invalid project details format.");
  }

  const { data: existingProject, error: existingError } = await supabase
    .from("portfolio_projects")
    .select("id, image_path")
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

  const image = formData.get("image");
  let newImagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(image.type)) {
      redirectWithError("Only JPEG, PNG, and WebP images are allowed.");
    }

    if (image.size > 10 * 1024 * 1024) {
      redirectWithError("Image must not exceed 10MB.");
    }

    const extension =
      image.type === "image/jpeg"
        ? "jpg"
        : image.type === "image/png"
          ? "png"
          : "webp";

    newImagePath = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(newImagePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      redirectWithError("Unable to upload replacement project image.");
    }
  }

  const imagePath = newImagePath
    ? newImagePath
    : removeImage
      ? null
      : existingProject.image_path;

  const { error: updateError } = await supabase
    .from("portfolio_projects")
    .update({
      title,
      slug,
      project_number: projectNumber || null,
      category_id: categoryId,
      image_path: imagePath,
      short_description: shortDescription,
      full_details: fullDetails,
      display_order: displayOrder,
    })
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
    redirectWithError("Project information was updated, but its display content could not be saved.");
  }

  if (
    existingProject.image_path &&
    (newImagePath || removeImage)
  ) {
    await supabase.storage
      .from("portfolio-images")
      .remove([existingProject.image_path]);
  }

  revalidatePortfolio();
  redirect("/admin/portfolio?projectUpdated=1");
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
  redirect("/admin/portfolio?projectPublished=1");
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
    .select("id, image_path")
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

  revalidatePortfolio();
  redirect("/admin/portfolio?projectDeleted=1");
}
