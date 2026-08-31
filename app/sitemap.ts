import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ROUTES: {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/invoice", priority: 0.9, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.6, changeFrequency: "monthly" },
  { path: "/guides/how-to-become-a-filer-in-pakistan", priority: 0.8, changeFrequency: "yearly" },
  { path: "/guides/pseb-registration-for-freelancers", priority: 0.8, changeFrequency: "yearly" },
  { path: "/guides/fbr-tax-slabs-freelancers", priority: 0.9, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
