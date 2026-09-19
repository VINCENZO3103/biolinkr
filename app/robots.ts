import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/login",
        "/signup",
        "/reset-password",
        "/update-password",
        "/api/",
      ],
    },
    sitemap: "https://biolinkr.me/sitemap.xml",
  };
}