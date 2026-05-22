import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { highlight } from "sugar-high";
import { getId } from "@/lib/utils";
import { ExternalLink } from "@/app/me/external-link";
import { DemoWithCode } from "@/components/ui/demo-with-code";
import { Grid } from "@/components/ui/grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { NavHoverDemo } from "@/components/ui/nav-hover-demo";
import { RecommenderPipeline } from "@/components/blog/recommender-pipeline";
import { RecSystemLandscape } from "@/components/blog/rec-system-landscape";

export const H1 = (props: ComponentPropsWithoutRef<"h1">) => (
  <h1 className="mb-8 font-semibold text-2xl md:text-4xl" {...props} />
);

export const H2 = ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => {
  const id = getId(children);
  return (
    <h2
      id={id}
      className="relative mb-8 mt-16 text-xl md:text-2xl font-medium"
      {...props}
    >
      {children}
    </h2>
  );
};

export const H3 = ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => {
  const id = getId(children);
  return (
    <h3
      id={id}
      className="text-lg md:text-xl mt-12 mb-4 font-medium"
      {...props}
    >
      {children}
    </h3>
  );
};

export const P = (props: ComponentPropsWithoutRef<"div">) => (
  <div
    className="mb-4 last:mb-0 leading-relaxed text-secondary-foreground"
    {...props}
  />
);

export const A = ({
  href,
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) => {
  const isInternal = href?.startsWith("/");
  const className =
    "text-blue-600 hover:underline hover:decoration-dotted hover:decoration-current hover:underline-offset-4 transition-all";

  if (isInternal) {
    return (
      <Link href={href!} className={className} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <ExternalLink href={href || "#"} className="text-blue-600 align-text-top">
      {children}
    </ExternalLink>
  );
};

export const Ol = ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
  <ol
    className="mb-4 list-none"
    style={{ counterReset: "counts 0" }}
    {...props}
  >
    {React.Children.toArray(children).map((child: any, index) =>
      child?.type === "li" ? (
        <li
          key={index}
          className="flex mb-2 before:content-[counter(counts)_'._'] before:pr-4 before:font-mono before:font-medium before:text-muted-foreground"
          style={{ counterIncrement: "counts 1" }}
        >
          <div className="flex-1 text-secondary-foreground">
            {child.props.children}
          </div>
        </li>
      ) : (
        child
      )
    )}
  </ol>
);

export const Ul = ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
  <ul
    className="mb-4 list-disc list-inside text-secondary-foreground"
    {...props}
  >
    {children}
  </ul>
);

export const Strong = (props: ComponentPropsWithoutRef<"strong">) => (
  <strong
    className="font-semibold text-secondary-foreground underline decoration-dotted decoration-current underline-offset-4"
    {...props}
  />
);

export const Blockquote = (props: ComponentPropsWithoutRef<"blockquote">) => (
  <blockquote
    className="mb-4 pl-4 border-l-2 border-secondary-foreground text-secondary-foreground"
    {...props}
  />
);

export const Pre = (props: ComponentPropsWithoutRef<"pre">) => (
  <pre
    className="mb-8 py-4 px-4 border bg-card rounded overflow-auto font-mono text-sm leading-relaxed"
    {...props}
  />
);

export const Code = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"code">) => {
  const isInline = !className?.includes("language-");
  if (isInline) {
    return (
      <code
        className="bg-accent px-1.5 py-0.5 rounded text-[0.9em] font-mono text-foreground border"
        {...props}
      >
        {children}
      </code>
    );
  }

  const codeString = typeof children === "string" ? children : "";
  const html = highlight(codeString);

  return (
    <code
      className="grid min-w-full"
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
};

export const Img = ({
  src,
  alt,
  ...props
}: ComponentPropsWithoutRef<"img">) => (
  <figure className="my-8">
    <img
      className="block w-full rounded-lg shadow-sm"
      src={src}
      alt={alt}
      loading="lazy"
      {...props}
    />
    {alt && (
      <figcaption className="mt-2 text-xs text-center text-muted-foreground font-mono">
        {alt}
      </figcaption>
    )}
  </figure>
);

export const Table = ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
  <div className="mb-8 overflow-x-auto rounded border">
    <table className="w-full text-sm border-collapse" {...props}>
      {React.Children.toArray(children).filter(
        (child) => !(typeof child === "string" && child.trim() === "")
      )}
    </table>
  </div>
);

export const Thead = ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
  <thead className="bg-accent/50" {...props}>
    {React.Children.toArray(children).filter(
      (child) => !(typeof child === "string" && child.trim() === "")
    )}
  </thead>
);

export const Tbody = ({ children, ...props }: ComponentPropsWithoutRef<"tbody">) => (
  <tbody {...props}>
    {React.Children.toArray(children).filter(
      (child) => !(typeof child === "string" && child.trim() === "")
    )}
  </tbody>
);

export const Tr = ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
  <tr className="border-b last:border-b-0" {...props}>
    {React.Children.toArray(children).filter(
      (child) => !(typeof child === "string" && child.trim() === "")
    )}
  </tr>
);

export const Th = (props: ComponentPropsWithoutRef<"th">) => (
  <th
    className="px-4 py-2.5 text-left font-medium text-foreground whitespace-nowrap"
    {...props}
  />
);

export const Td = (props: ComponentPropsWithoutRef<"td">) => (
  <td
    className="px-4 py-2.5 text-secondary-foreground"
    {...props}
  />
);

export const Hr = () => (
  <hr className="my-12 border-t border-dashed border-neutral-300 dark:border-neutral-700" />
);

export const components = {
  DemoWithCode,
  Grid,
  BorderBeam,
  NavHoverDemo,
  RecommenderPipeline,
  RecSystemLandscape,
  h1: H1,
  H1: H1,
  h2: H2,
  H2: H2,
  h3: H3,
  H3: H3,
  p: P,
  P: P,
  a: A,
  A: A,
  ol: Ol,
  Ol: Ol,
  ul: Ul,
  Ul: Ul,
  strong: Strong,
  Strong: Strong,
  blockquote: Blockquote,
  Blockquote: Blockquote,
  pre: Pre,
  Pre: Pre,
  code: Code,
  Code: Code,
  img: Img,
  Img: Img,
  hr: Hr,
  Hr: Hr,
  table: Table,
  Table: Table,
  thead: Thead,
  Thead: Thead,
  tbody: Tbody,
  Tbody: Tbody,
  tr: Tr,
  Tr: Tr,
  th: Th,
  Th: Th,
  td: Td,
  Td: Td,
};

export function useMDXComponents(currentComponents: any) {
  return {
    ...currentComponents,
    ...components,
  };
}
