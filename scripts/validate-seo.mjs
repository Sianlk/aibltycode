import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const fail = [];
const pass = [];

function assert(condition, message) {
  (condition ? pass : fail).push(message);
}

const index = read("index.html");
const robots = read("public/robots.txt");
const sitemap = read("public/sitemap.xml");
const curriculum = read("public/curriculum.html");
const llms = read("public/llms.txt");
const seo = read("src/components/seo/Seo.tsx");
const generator = read("scripts/generate-seo-pages.mjs");

assert(/<html\s+lang="en-GB"/i.test(index), "home declares en-GB language");
assert(index.includes('name="viewport"'), "mobile viewport exists");
assert(index.includes('rel="icon"') && index.includes("/favicon.png"), "favicon is linked");
assert(index.includes('name="google-site-verification"'), "Google Search Console verification is present");
assert(index.includes('rel="canonical" href="https://aiblty.com/"'), "home canonical is absolute");
assert(!/lovable/i.test(index), "public home metadata contains no Lovable branding");

for (const type of ["Organization", "WebSite", "EducationalOrganization", "SoftwareApplication", "FAQPage"]) {
  assert(index.includes(`"@type": "${type}"`), `structured data includes ${type}`);
}
assert(index.includes('"@type": "SearchAction"'), "website schema includes SearchAction");
assert(index.includes('"price": "5.99"') && index.includes('"priceCurrency": "GBP"'), "software offer exposes £5.99 GBP price");

for (const tag of [
  'property="og:title"', 'property="og:description"', 'property="og:url"',
  'property="og:locale"', 'property="og:image"', 'name="twitter:card"',
  'name="twitter:title"', 'name="twitter:description"', 'name="twitter:image"'
]) {
  assert(index.includes(tag), `home social metadata includes ${tag}`);
}
assert(index.includes('content="https://aiblty.com/app-icon.png"'), "home social image is absolute");

for (const bot of ["Googlebot", "Bingbot", "Twitterbot", "facebookexternalhit", "User-agent: *"]) {
  assert(robots.includes(bot), `robots.txt explicitly permits ${bot}`);
}
assert(robots.includes("Sitemap: https://aiblty.com/sitemap.xml"), "robots.txt points to canonical sitemap");

assert(/<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/.test(sitemap), "sitemap is a standard XML urlset");
for (const url of ["https://aiblty.com/", "https://aiblty.com/curriculum.html", "https://aiblty.com/courses/"]) {
  assert(sitemap.includes(url), `sitemap includes ${url}`);
}
assert(!/lovable/i.test(sitemap), "sitemap contains no Lovable domain");

assert(/absolute beginner/i.test(curriculum) && /professional/i.test(curriculum), "crawlable curriculum explains beginner-to-professional progression");
assert(/Learning method:/i.test(llms) && /spaced repetition/i.test(llms), "llms.txt exposes the learning method to AI assistants");
assert(llms.includes("https://aiblty.com/curriculum.html"), "llms.txt points AI assistants to the canonical curriculum");

for (const token of [
  "<title>{title}</title>",
  'name="description"',
  'rel="canonical"',
  'property="og:url"',
  'property="og:image"',
  'name="twitter:card"',
  'name="twitter:image"'
]) {
  assert(seo.includes(token), `per-route SEO includes ${token}`);
}
assert(seo.includes('const SITE = "https://aiblty.com"'), "per-route canonical base is independent aiblty.com");
assert(generator.includes("curriculum.html") && generator.includes("sitemap.xml") && generator.includes("llms.txt"), "SEO generator emits discovery assets");
assert(generator.includes("Twitterbot") && generator.includes("facebookexternalhit"), "SEO generator preserves explicit social crawler rules");
assert(generator.includes('meta name="twitter:title"') && generator.includes('meta name="twitter:description"'), "generated course pages have complete Twitter cards");

for (const asset of ["public/favicon.png", "public/app-icon.png", "public/logo192.png", "public/logo512.png"]) {
  assert(fs.existsSync(path.join(root, asset)), `SEO/PWA asset exists: ${asset}`);
}

console.log(`SEO release gate: ${pass.length} checks passed.`);
if (fail.length) {
  console.error(`\n${fail.length} SEO check(s) failed:`);
  for (const message of fail) console.error(` - ${message}`);
  process.exit(1);
}
console.log("Robots, schema, OG/Twitter, sitemap, crawlable curriculum and AI discovery checks passed.");
