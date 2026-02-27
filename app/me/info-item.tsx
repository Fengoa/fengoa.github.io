import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoItemProps {
  icon?: ReactNode;
  href?: string;
  children: ReactNode;
  className?: string;
}

export function InfoItem({ icon, href, children, className }: InfoItemProps) {
  const classes = cn(
    "text-sm text-muted-foreground leading-relaxed inline-flex items-center gap-1.5",
    href && "hover:text-foreground transition-colors",
    className
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal && !href.startsWith("mailto:")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <p className={classes}>
      {icon}
      {children}
    </p>
  );
}
