import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createPageUrl(pageName: string): string {
  if (pageName === "Home") {
    return "/";
  }

  return `/${pageName.toLowerCase()}`;
}

export function createPageUrlAdvanced(
  pageName: string,
  basePath: string = ""
): string {
  if (pageName === "Home") {
    return basePath || "/";
  }

  const cleanName = pageName.toLowerCase().replace(/\s+/g, "-");
  return `${basePath}/${cleanName}`;
}
