import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description?: string;
  image?: string;
}

const DEFAULT_DESCRIPTION = "Discover trending, current, and upcoming anime.";
const DEFAULT_IMAGE = "/og-preview.jpg";
const SITE_NAME = "Cleanime";

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(
      attr === "content" ? "name" : "property",
      selector.match(/\[(?:name|property)="(.+?)"\]/)?.[1] ?? "",
    );
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const useSEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
}: SEOOptions) => {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;

    document.title = fullTitle;

    setMeta('meta[name="description"]', "content", description);

    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]', "content", image);

    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", image);
  }, [title, description, image]);
};

export default useSEO;
