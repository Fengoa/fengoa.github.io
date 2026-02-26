import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { highlight } from "sugar-high";
import { getId } from "@/lib/utils";

export const H1 = (props: ComponentPropsWithoutRef<"h1">) => (
  <h1 className="mb-8 font-semibold text-2xl md:text-4xl" {...props} />
);

export const H2 = ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => {
  const id = getId(children);
  return (
    <h2
      id={id}
      className="relative mb-8 mt-24 text-xl md:text-2xl font-medium before:absolute before:-top-4 before:left-0 before:h-[3px] before:w-6 before:bg-current"
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

export const P = (props: ComponentPropsWithoutRef<"p">) => (
  <p className="mb-4 last:mb-0 leading-relaxed text-foreground/80" {...props} />
);

export const A = ({
  href,
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) => {
  const isInternal = href?.startsWith("/");
  const className =
    "text-blue-500 hover:underline hover:decoration-dotted hover:decoration-current hover:underline-offset-4 transition-all";

  if (isInternal) {
    return (
      <Link href={href!} className={className} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
      <svg
        className="relative -top-px inline-block size-4 ml-0.5"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          d="m6 18l2.5-2.5M18 6H9m9 0v9m0-9l-6.5 6.5"
        />
      </svg>
    </a>
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
          className="flex mb-2 before:content-[counter(counts)_'._'] before:pr-4 before:font-mono before:font-medium before:text-gray-500"
          style={{ counterIncrement: "counts 1" }}
        >
          <div className="flex-1 text-foreground/80">
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
  <ul className="mb-4 list-disc list-inside text-foreground/80" {...props}>
    {children}
  </ul>
);

export const Strong = (props: ComponentPropsWithoutRef<"strong">) => (
  <strong
    className="font-bold underline decoration-dotted decoration-current underline-offset-4"
    {...props}
  />
);

export const Blockquote = (props: ComponentPropsWithoutRef<"blockquote">) => (
  <blockquote
    className="mb-4 pl-4 border-l-2 border-gray-500 text-foreground/70 italic"
    {...props}
  />
);

export const Pre = (props: ComponentPropsWithoutRef<"pre">) => (
  <pre
    className="mb-8 py-4 px-4 border border-neutral-200 dark:border-neutral-800 rounded-md overflow-auto bg-transparent font-mono text-sm leading-relaxed"
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
        className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-md text-[0.9em] font-mono text-foreground/90 border border-neutral-200/50 dark:border-neutral-700/50"
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
      <figcaption className="mt-2 text-xs text-center text-neutral-400 font-mono">
        {alt}
      </figcaption>
    )}
  </figure>
);

export const Hr = () => (
  <hr className="my-12 border-t border-dashed border-neutral-300 dark:border-neutral-700" />
);

export const components = {
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
};

export function useMDXComponents(currentComponents: any) {
  return {
    ...currentComponents,
    ...components,
  };
}
