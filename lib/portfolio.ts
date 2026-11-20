
import { createClient } from "@/lib/supabase";

export async function getPublishedPortfolio() {
  const supabase = await createClient();

  const { data: categories, error: categoryError } = await supabase
    .from("portfolio_categories")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (categoryError) {
    console.error("Failed to fetch portfolio categories:", categoryError);
    return { categories: [], projects: [], details: [] };
  }

  const { data: projects, error: projectError } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (projectError) {
    console.error("Failed to fetch portfolio projects:", projectError);
    return { categories, projects: [], details: [] };
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
    console.error("Failed to fetch portfolio details:", detailsError);
    return {
      categories,
      projects: projectsWithImageUrls,
      details: [],
    };
  }

  return {
    categories,
    projects: projectsWithImageUrls,
    details,
  };
}
