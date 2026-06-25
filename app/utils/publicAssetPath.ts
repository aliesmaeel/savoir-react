const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

export function publicAssetPath(path: string) {
  if (
    !path ||
    ABSOLUTE_URL_PATTERN.test(path) ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = import.meta.env.BASE_URL || "/";

  if (baseUrl === "/") return normalizedPath;

  return `${baseUrl.replace(/\/$/, "")}${normalizedPath}`;
}
