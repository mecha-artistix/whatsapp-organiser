import { useLocation } from "react-router-dom";

export function usePageName() {
  const { pathname } = useLocation();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) =>
      seg
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );

  return segments.join(" / ") || "Dashboard";
}
