
import { createClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function getAdminPortfolio() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: categories, error: categoryError } = await supabase
    .from("portfolio_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (categoryError) {
    throw new Error(
      `Category query failed | Code: ${categoryError.code} | Message: ${categoryError.message} | Details: ${categoryError.details} | Hint: ${categoryError.hint}`
    );
  }

  const { data: projects, error: projectError } = await supabase
    .from("portfolio_projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (projectError) {
    throw new Error(
      `Project query failed | Code: ${projectError.code} | Message: ${projectError.message} | Details: ${projectError.details} | Hint: ${projectError.hint}`
    );
  }

  const projectsWithImageUrls = projects.map((project) => {
    const imageUrl = project.image_path
      ? supabase.storage
          .from("portfolio-images")
          .getPublicUrl(project.image_path).data.publicUrl
      : null;

    return {
      ...project,
      image_url: imageUrl,
    };
  });

  const projectIds = projects.map((project) => project.id);

  if (projectIds.length === 0) {
    return {
      categories,
      projects: projectsWithImageUrls,
      details: [],
    };
  }

  const { data: details, error: detailsError } = await supabase
    .from("portfolio_project_details")
    .select("*")
    .in("project_id", projectIds);

  if (detailsError) {
    throw new Error(
      `Details query failed | Code: ${detailsError.code} | Message: ${detailsError.message} | Details: ${detailsError.details} | Hint: ${detailsError.hint}`
    );
  }

  return {
    categories,
    projects: projectsWithImageUrls,
    details,
  };
}
