import rawProjects from "@/data/projects.json";

export interface ProjectScreenshot {
  url: string;
  caption: string;
}

export interface Project {
  slug: string;
  title: string;
  tag: string;
  year: string;
  summary: string;
  description: string;
  role?: string;
  duration?: string;
  features: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  screenshots: ProjectScreenshot[];
}

export const projects: Project[] = rawProjects as Project[];

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
