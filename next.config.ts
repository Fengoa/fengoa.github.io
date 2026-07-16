import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /**
   * Enable static exports.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: "export",

  /**
   * Set base path. This is usually the slug of your repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "",

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },

  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // Use Rust MDX compiler with GFM support (tables, strikethrough, etc.)
  experimental: {
    mdxRs: {
      mdxType: "gfm",
    },
  },

  // 锁定 Turbopack 根目录，避免向上找到 ~/package.json 导致 tailwindcss 解析失败
  turbopack: {
    root: projectRoot,
  },
};

const withMDX = createMDX({});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
