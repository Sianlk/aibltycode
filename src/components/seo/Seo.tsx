import { Helmet } from "react-helmet-async";

const SITE = "https://aiblty.com";

interface SeoProps {
  title: string;
  description: string;
  /** Path beginning with "/" — used for canonical and og:url. */
  path: string;
  noindex?: boolean;
}

/**
 * Per-route head tags. Keeps canonical and og:url self-referencing so
 * crawlers attribute each page's title/description to its own URL.
 */
export const Seo = ({ title, description, path, noindex }: SeoProps) => {
  const url = `${SITE}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
    </Helmet>
  );
};

export default Seo;