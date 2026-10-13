import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import ProjectScreenshot from "@/components/ProjectScreenshot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found — Individev",
    };
  }

  return {
    title: `${project.title} — Individev`,
    description: project.summary,
  };
}

function ProjectDetailSkeleton() {
  return (
    <main className="project-detail__content" aria-busy="true">
      <header className="project-detail__header">
        <div
          style={{
            height: "1rem",
            width: "120px",
            backgroundColor: "var(--color-surface)",
            borderRadius: "4px",
            marginBottom: "1.25rem",
          }}
        />
        <div
          style={{
            height: "3.5rem",
            width: "60%",
            backgroundColor: "var(--color-surface)",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        />
        <div
          style={{
            height: "1.5rem",
            width: "80%",
            backgroundColor: "var(--color-surface)",
            borderRadius: "4px",
          }}
        />
      </header>
      <section className="project-detail__meta-grid">
        <div className="project-detail__meta-box">
          <div
            style={{
              height: "0.75rem",
              width: "40px",
              backgroundColor: "var(--color-surface)",
              borderRadius: "4px",
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              height: "1rem",
              width: "100px",
              backgroundColor: "var(--color-surface)",
              borderRadius: "4px",
            }}
          />
        </div>
        <div className="project-detail__meta-box">
          <div
            style={{
              height: "0.75rem",
              width: "50px",
              backgroundColor: "var(--color-surface)",
              borderRadius: "4px",
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              height: "1rem",
              width: "80px",
              backgroundColor: "var(--color-surface)",
              borderRadius: "4px",
            }}
          />
        </div>
        <div className="project-detail__meta-box project-detail__meta-box--tech">
          <div
            style={{
              height: "0.75rem",
              width: "60px",
              backgroundColor: "var(--color-surface)",
              borderRadius: "4px",
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              height: "1.5rem",
              width: "160px",
              backgroundColor: "var(--color-surface)",
              borderRadius: "4px",
            }}
          />
        </div>
      </section>
    </main>
  );
}

export default function ProjectDetailPage({ params }: PageProps) {
  return (
    <div className="project-detail">
      {/* Navigation */}
      <nav className="nav">
        <Link href="/" className="nav__logo">
          Individev
        </Link>
        <ul className="nav__links">
          <li>
            <Link href="/#projects">← Back to Projects</Link>
          </li>
          <li>
            <Link href="/#contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectDetailContent params={params} />
      </Suspense>
    </div>
  );
}

async function ProjectDetailContent({ params }: PageProps) {
  const { slug } = await params;
  const projects = getAllProjects();
  const currentIndex = projects.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const project = projects[currentIndex];
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <main className="project-detail__content">
        {/* Header Section */}
        <header className="project-detail__header">
          <div className="project-detail__badge">
            <span className="project-detail__badge-index">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <span className="project-detail__badge-divider">/</span>
            <span className="project-detail__badge-tag">{project.tag}</span>
            <span className="project-detail__badge-dot">•</span>
            <span className="project-detail__badge-year">{project.year}</span>
          </div>

          <h1 className="project-detail__title">{project.title}</h1>
          <p className="project-detail__summary">{project.summary}</p>

          {/* Links Bar */}
          <div className="project-detail__cta-row">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-detail__btn project-detail__btn--primary"
              >
                <span>Live Preview</span>
                <span className="btn-arrow">↗</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-detail__btn project-detail__btn--secondary"
              >
                <span>Source Code</span>
                <span className="btn-arrow">↗</span>
              </a>
            )}
          </div>
        </header>

        {/* Metadata Grid */}
        <section className="project-detail__meta-grid">
          {project.role && (
            <div className="project-detail__meta-box">
              <span className="meta-label">Role</span>
              <span className="meta-value">{project.role}</span>
            </div>
          )}
          {project.duration && (
            <div className="project-detail__meta-box">
              <span className="meta-label">Timeline</span>
              <span className="meta-value">{project.duration}</span>
            </div>
          )}
          <div className="project-detail__meta-box project-detail__meta-box--tech">
            <span className="meta-label">Tech Stack</span>
            <div className="meta-tags">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="meta-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Overview & Features */}
        <section className="project-detail__section">
          <h2 className="section__label">About the Project</h2>
          <p className="project-detail__description">{project.description}</p>

          {project.features && project.features.length > 0 && (
            <div className="project-detail__features">
              <h3 className="features-title">Core Highlights & Capabilities</h3>
              <ul className="features-list">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="features-item">
                    <span className="feature-bullet">—</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Screenshots Showcase */}
        <section className="project-detail__section">
          <div className="screenshots-header">
            <h2 className="section__label">Screenshots &amp; Previews</h2>
            <span className="screenshots-count">
              {project.screenshots.length} Preview
              {project.screenshots.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="project-detail__screenshots">
            {project.screenshots.map((shot, idx) => (
              <ProjectScreenshot
                key={idx}
                url={shot.url}
                caption={shot.caption}
                index={idx}
              />
            ))}
          </div>
        </section>
      </main>
  );
}
