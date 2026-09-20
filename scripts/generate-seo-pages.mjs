import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const coursesDir = path.join(publicDir, "courses");
const canonical = "https://aiblty.com";

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const decode = (s) => JSON.parse(`"${s}"`);
const esc = (s = "") => s
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function exportBlock(source, startName, endName) {
  const start = source.indexOf(`export const ${startName}`);
  if (start < 0) return "";
  const end = source.indexOf(`export const ${endName}`, start);
  return source.slice(start, end < 0 ? source.length : end);
}

function parseLessons(block) {
  const modules = {};
  const arrayRe = /^\s*"([^"]+)":\s*\[\n([\s\S]*?)^\s*\],/gm;
  for (const match of block.matchAll(arrayRe)) {
    const moduleId = match[1];
    const body = match[2];
    const lessons = [];
    const objectRe = /\{\s*id:\s*"((?:\\.|[^"])*)",\s*title:\s*"((?:\\.|[^"])*)",\s*description:\s*"((?:\\.|[^"])*)"/g;
    const helperRe = /\bL\(\s*"((?:\\.|[^"])*)",\s*"((?:\\.|[^"])*)",\s*"((?:\\.|[^"])*)"/g;
    for (const m of body.matchAll(objectRe)) lessons.push({ id: decode(m[1]), title: decode(m[2]), description: decode(m[3]) });
    for (const m of body.matchAll(helperRe)) lessons.push({ id: decode(m[1]), title: decode(m[2]), description: decode(m[3]) });
    if (lessons.length) modules[moduleId] = lessons;
  }
  return modules;
}

function parseInfo(block) {
  const out = {};
  const re = /"([^"]+)":\s*\{\s*title:\s*"((?:\\.|[^"])*)"/g;
  for (const m of block.matchAll(re)) out[m[1]] = decode(m[2]);
  return out;
}

function parseDescriptions(block) {
  const out = {};
  const re = /"([^"]+)":\s*"((?:\\.|[^"])*)"/g;
  for (const m of block.matchAll(re)) out[m[1]] = decode(m[2]);
  return out;
}

const moduleData = read("src/data/moduleData.ts");
const extraData = read("src/data/moduleDataExtra.ts");

const modules = {
  ...parseLessons(exportBlock(moduleData, "moduleLessons", "moduleInfo")),
  ...parseLessons(exportBlock(extraData, "extraModuleLessons", "extraModuleInfo")),
};
const titles = {
  ...parseInfo(exportBlock(moduleData, "moduleInfo", "moduleDescriptions")),
  ...parseInfo(exportBlock(extraData, "extraModuleInfo", "extraModuleDescriptions")),
};
const descriptions = {
  ...parseDescriptions(exportBlock(moduleData, "moduleDescriptions", "Object")),
  ...parseDescriptions(exportBlock(extraData, "extraModuleDescriptions", "__END__")),
};

fs.mkdirSync(coursesDir, { recursive: true });
for (const existing of fs.readdirSync(coursesDir)) {
  if (existing.endsWith(".html")) fs.unlinkSync(path.join(coursesDir, existing));
}

const ordered = Object.entries(modules);
const totalLessons = ordered.reduce((sum, [, lessons]) => sum + lessons.length, 0);

const head = (title, description, url, jsonLd) => `<!doctype html>
<html lang="en-GB"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="AIblty"><meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${canonical}/app-icon.png"><meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@AIblty">
<meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${canonical}/app-icon.png"><meta name="twitter:image:alt" content="${esc(title)}">
<link rel="icon" type="image/png" href="/favicon.png">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
body{font-family:system-ui,-apple-system,sans-serif;max-width:1050px;margin:auto;padding:32px 20px;line-height:1.55;color:#0f172a}
a{color:#2563eb}.hero{padding:28px;border-radius:20px;background:#f1f5f9}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}
.card{border:1px solid #e2e8f0;border-radius:14px;padding:16px}.muted{color:#475569}.cta{display:inline-block;padding:12px 18px;border-radius:10px;background:#0f172a;color:#fff;text-decoration:none;font-weight:700}
ol{padding-left:24px}li{margin:12px 0}.level{font-weight:700;color:#0f766e}
</style></head><body>`;

for (const [moduleId, lessons] of ordered) {
  const title = titles[moduleId] || moduleId.replaceAll("-", " ");
  const description = descriptions[moduleId] || `Learn ${title} from absolute beginner to advanced professional level.`;
  const url = `${canonical}/courses/${moduleId}.html`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description,
    url,
    provider: { "@type": "Organization", name: "AIblty", url: canonical },
    educationalLevel: "Absolute beginner to degree, professional and expert level",
    teaches: lessons.slice(0, 80).map((l) => l.title),
  };
  const list = lessons.map((l, i) => `<li><strong>${esc(l.title)}</strong> — ${esc(l.description)}</li>`).join("\n");
  const html = head(`${title} Course | AIblty`, description, url, schema) + `
<div class="hero"><p class="level">Zero knowledge → degree → professional → expert</p><h1>${esc(title)}</h1>
<p>${esc(description)}</p><p><strong>${lessons.length} structured topics</strong>, each reinforced with plain-language teaching, memory hooks, hands-on practice, retrieval, teach-back, speed recall, professional transfer and spaced review.</p>
<a class="cta" href="/auth">Start learning</a></div>
<h2>How mastery works</h2><div class="grid">
<div class="card"><strong>1. Five-year-old simple</strong><p class="muted">Every new term is explained without assumed knowledge and linked to a familiar picture.</p></div>
<div class="card"><strong>2. Do it</strong><p class="muted">Guided labs, typing, diagrams, configurations, queries or professional artefacts turn words into usable skill.</p></div>
<div class="card"><strong>3. Retrieve it</strong><p class="muted">No-peeking recall, teach-back and 60-second checks force the brain to retrieve instead of recognise.</p></div>
<div class="card"><strong>4. Use it professionally</strong><p class="muted">Failure modes, security, evidence, capstones and spaced repetition build degree and workplace fluency.</p></div>
</div>
<h2>Course topics</h2><ol>${list}</ol>
<p><a href="/curriculum.html">← View the complete AIblty curriculum</a></p>
</body></html>`;
  fs.writeFileSync(path.join(coursesDir, `${moduleId}.html`), html);
}

const cards = ordered.map(([id, lessons]) => {
  const title = titles[id] || id;
  const description = descriptions[id] || "";
  return `<article class="card"><h2><a href="/courses/${id}.html">${esc(title)}</a></h2><p>${esc(description)}</p><p><strong>${lessons.length} topics</strong></p></article>`;
}).join("\n");

const curriculumSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AIblty complete technology curriculum",
  numberOfItems: ordered.length,
  itemListElement: ordered.map(([id], index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${canonical}/courses/${id}.html`,
    name: titles[id] || id,
  })),
};

fs.writeFileSync(path.join(publicDir, "curriculum.html"),
  head("AIblty Complete Technology Curriculum | 1,200+ Topics", `${totalLessons} structured lessons across ${ordered.length} learning tracks from age-five-simple foundations to degree, professional and expert mastery.`, `${canonical}/curriculum.html`, curriculumSchema) +
  `<div class="hero"><p class="level">Absolute beginner → professor-level thinking</p><h1>Complete AIblty curriculum</h1>
  <p>${totalLessons} structured topics across ${ordered.length} tracks including Java, Python, JavaScript, HTML/CSS, SQL, databases, data science, AI, cybersecurity, networking, systems administration, Excel/enterprise tools, Agile/Waterfall/PRINCE2, CAD and BIM.</p>
  <a class="cta" href="/auth">Start learning</a></div><div class="grid">${cards}</div></body></html>`
);

const urls = [
  ["/", "1.0"], ["/pricing", "0.8"], ["/install", "0.7"], ["/privacy.html", "0.6"], ["/curriculum.html", "1.0"],
  ...ordered.map(([id]) => [`/courses/${id}.html`, "0.9"]),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(([p, priority]) => `  <url><loc>${canonical}${p}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

fs.writeFileSync(path.join(publicDir, "robots.txt"),
`User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: ${canonical}/sitemap.xml
`);

const llms = [
  "# AIblty",
  "> Technology learning platform designed for absolute beginners through degree, professional and expert mastery.",
  "",
  `AIblty contains ${totalLessons} structured topics across ${ordered.length} learning tracks.`,
  "Learning method: five-year-old-simple explanation, mnemonic/visual anchor, guided practice, no-peeking retrieval, Feynman teach-back, 60-second recall, professional transfer and spaced repetition.",
  "",
  "## Curriculum",
  ...ordered.map(([id, lessons]) => `- ${titles[id] || id}: ${descriptions[id] || ""} (${lessons.length} topics) — ${canonical}/courses/${id}.html`),
  "",
  "Canonical curriculum index: https://aiblty.com/curriculum.html",
  "Privacy: https://aiblty.com/privacy.html",
].join("\n");
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms + "\n");

console.log(`Generated SEO: ${ordered.length} course pages, ${totalLessons} lessons represented, sitemap and llms.txt.`);
