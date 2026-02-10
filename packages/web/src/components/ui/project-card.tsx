import { ExternalLinkIcon } from "./icons";
import { cn } from "~/lib/cn";

type ProjectCardProps = {
  title: string;
  description: string;
  href: string;
  image?: string;
  tags?: string[];
  featured?: boolean;
  className?: string;
};

export function ProjectCard({
  title,
  description,
  href,
  image,
  tags,
  featured,
  className,
}: ProjectCardProps) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "project-card group",
        featured && "project-card-featured",
        className
      )}
    >
      {image && (
        <div className="project-card-image">
          <img src={image} alt={`Screenshot of ${title}`} loading="lazy" />
        </div>
      )}
      <div className="project-card-content">
        <div className="project-card-header">
          <h3 className="project-card-title">
            {title}
            {isExternal && (
              <ExternalLinkIcon
                size={14}
                className="project-card-external-icon"
              />
            )}
          </h3>
        </div>
        <p className="project-card-description">{description}</p>
        {tags && tags.length > 0 && (
          <div className="project-card-tags">
            {tags.map((tag) => (
              <span key={tag} className="project-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

// Horizontal scrolling projects container
type ProjectsCarouselProps = {
  children: React.ReactNode;
  className?: string;
};

export function ProjectsCarousel({ children, className }: ProjectsCarouselProps) {
  return (
    <div className={cn("projects-carousel-wrapper", className)}>
      <div className="projects-carousel">{children}</div>
    </div>
  );
}
