import { Helmet } from "react-helmet-async";

const SITE = "https://aiblty.com";
const DEFAULT_IMAGE = `${SITE}/app-icon.png`;

interface SeoProps {
  title: string;
  description: string;
  /** Path beginning with "/" — used for canonical and og:url. */
  path: string;
  noindex?: boolean;
  image?: string;
}

/**
 * Complete per-route metadata for browser, search and social crawlers.
 * Public pages receive self-referencing canonical URLs and absolute social imagery.
 */
export const Seo = ({ title, description, path, noindex, image = DEFAULT_IMAGE }: SeoProps) => {
  const url = `${SITE}${path}`;
  const robots = noindex
    ? "noindex, follow"
    : "index, follow, max-image-preview:large, max-snippet:-1";

  return (
    <Helmet>
      <html lang="en-GB" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="en-GB" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      <meta property="og:site_name" content="AIblty" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@AIblty" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
    </Helmet>
  );
};

export default Seo;
