import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = [];
const pass = [];

function assert(condition, message) {
  if (condition) pass.push(message);
  else fail.push(message);
}

const moduleData = read('src/data/moduleData.ts');
const extraData = read('src/data/moduleDataExtra.ts');
const dashboard = read('src/pages/Dashboard.tsx');
const gamePage = read('src/pages/GamePage.tsx');
const app = read('src/App.tsx');
const lessonPage = read('src/pages/LessonPage.tsx');
const lessonGenerator = read('src/data/lessonGenerator.ts');
const expandedMasteryGenerator = read('src/data/expandedMasteryGenerator.ts');
const retentionEngine = read('src/data/retentionEngine.ts');
const retentionGate = read('src/components/lessons/RetentionGate.tsx');
const skillMastery = read('src/hooks/useSkillMastery.ts');
const pkg = JSON.parse(read('package.json'));
const gitignore = read('.gitignore');

const requiredModules = [
  'java-foundations',
  'systems-analysis',
  'math-computing',
  'cybersecurity',
  'ai-data-science',
  'business-systems',
  'game-development',
  'computer-systems',
  'web-technologies',
  'python-programming',
  'javascript-web',
  'ai-builder',
  'digital-marketing',
  'animation-motion',
  'software-tools',
  'project-delivery',
];

const curriculumSource = `${moduleData}\n${extraData}`;
for (const id of requiredModules) {
  assert(curriculumSource.includes(`"${id}"`), `module registered: ${id}`);
}

// AIBLTYCODE's brief deliberately spans software, infrastructure, AI, business,
// delivery and growth. These checks make accidental content regression visible.
const requiredConcepts = [
  ['Java', /Java/i],
  ['Python', /Python/i],
  ['JavaScript', /JavaScript/i],
  ['HTML', /HTML/i],
  ['CSS', /CSS/i],
  ['SQL', /SQL/i],
  ['data science', /data science/i],
  ['machine learning', /machine learning/i],
  ['GPT/custom AI', /GPT/i],
  ['AI agents', /AI Agents|multi-agent/i],
  ['RAG/vector search', /RAG|vector database/i],
  ['AI auditing', /AI Auditing/i],
  ['AI monitoring', /AI Monitoring/i],
  ['cybersecurity', /Cybersecurity|cyber security/i],
  ['computer hardware', /Building a PC|CPU, RAM|hardware/i],
  ['networking', /Networking/i],
  ['Cisco IOS', /Cisco IOS/i],
  ['Cisco routing/switching', /Cisco.*Routing|Routing Fundamentals|Switching & VLANs/i],
  ['legacy systems integration', /Legacy Systems/i],
  ['virtualisation', /Virtual Machines|VMware|virtualisation/i],
  ['cloud platforms', /AWS|Azure/i],
  ['containers', /Docker/i],
  ['CI/CD', /CI\/CD|GitHub Actions/i],
  ['SAP', /SAP/i],
  ['Sage', /Sage Accounting/i],
  ['ERP', /ERP/i],
  ['CRM', /CRM/i],
  ['Excel', /Excel/i],
  ['Power BI', /Power BI/i],
  ['SEO', /SEO/i],
  ['analytics', /Analytics/i],
  ['digital marketing', /Digital Marketing|Google Ads|Email Marketing/i],
  ['animation', /Animation/i],
  ['3D/Three.js', /Three\.js|3D Basics/i],
  ['Waterfall', /Waterfall/i],
  ['Agile', /Agile/i],
  ['Scrum', /Scrum/i],
  ['Kanban', /Kanban/i],
  ['PRINCE2', /PRINCE2/i],
  ['ITIL', /ITIL/i],
  ['Git/GitHub', /Git & GitHub|GitHub Workflow/i],
  ['app publishing', /App Store Publishing|Play Store/i],
];

for (const [label, regex] of requiredConcepts) {
  assert(regex.test(curriculumSource), `spec concept covered: ${label}`);
}

// Count metadata lessons. Original modules use object literals; expansion modules
// use the L(...) helper. This is a regression floor, not a marketing claim.
const originalLessonIds = [...moduleData.matchAll(/\{\s*id:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const extraLessonIds = [...extraData.matchAll(/\bL\(\s*["']([^"']+)["']/g)].map((m) => m[1]);
const allLessonIds = [...originalLessonIds, ...extraLessonIds];
const lessonMetadataCount = allLessonIds.length;
const duplicateLessonIds = [...new Set(allLessonIds.filter((id, index) => allLessonIds.indexOf(id) !== index))];
assert(lessonMetadataCount >= 700, `lesson metadata floor met (${lessonMetadataCount} >= 700)`);
assert(duplicateLessonIds.length === 0, `lesson IDs are globally unique${duplicateLessonIds.length ? `: ${duplicateLessonIds.join(', ')}` : ''}`);

// The expansion curriculum must not fall back to thin definition-only lessons.
assert(lessonGenerator.includes('generateExpandedMasterySteps'), 'expanded mastery generator wired into lesson resolution');
for (const moduleId of ['python-programming', 'javascript-web', 'ai-builder', 'digital-marketing', 'animation-motion', 'software-tools', 'project-delivery']) {
  assert(expandedMasteryGenerator.includes(`"${moduleId}"`) || expandedMasteryGenerator.includes(`'${moduleId}'`), `practical mastery path defined: ${moduleId}`);
}
for (const masteryPrimitive of ['jargon', 'mental model', 'hands-on', 'workplace', 'checklist', 'failure', 'capstone', '60-second']) {
  assert(expandedMasteryGenerator.toLowerCase().includes(masteryPrimitive), `expanded mastery primitive present: ${masteryPrimitive}`);
}

// Universal retention gate: every routed lesson must pass mnemonic encoding,
// retrieval practice, child-simple teach-back, fast recall and professional transfer.
assert(lessonPage.includes('RetentionGate'), 'all routed lessons pass through the universal retention gate');
assert(lessonPage.includes('coreLessonComplete'), 'core lesson completion transitions into retention rather than exiting immediately');
for (const stage of ['memory', 'recall', 'teach', 'fast', 'transfer']) {
  assert(retentionGate.includes(`"${stage}"`), `retention stage present: ${stage}`);
}
assert(retentionGate.includes('MIND memory code'), 'mnemonic encoding is learner-visible');
assert(/8-year-old|child/i.test(retentionGate), 'child-simple Feynman teach-back is required');
assert(/60-second|60 seconds/i.test(retentionGate), 'fast-recall timing is required');
assert(/Professional transfer/i.test(retentionGate), 'professional transfer is required');
assert(retentionEngine.includes('scheduleLocalReview'), 'anonymous/offline review scheduling exists');
assert(retentionEngine.includes('getDueLocalReviews'), 'due-review retrieval exists');
assert(retentionEngine.includes('retentionEngineSelfTest'), 'retention scheduling self-test exists');
assert(/1\s*day[\s\S]*6\s*days|1 day -> 6 days/.test(skillMastery), 'signed-in spaced repetition follows 1-day then 6-day progression');
assert(!/const repetitions\s*=\s*0\s*;/.test(skillMastery), 'spaced repetition does not reset successful repetitions on every review');
assert(/currentInterval\s*<=\s*1\s*\?\s*1\s*:\s*2/.test(skillMastery), 'persisted SM-2 phase is inferred from review interval');

// Verify every visible dashboard game resolves to a real game component unless it
// intentionally links to a standalone route (currently battle/sandbox).
const gameBlock = dashboard.match(/const gameModes = \[([\s\S]*?)\n\];/);
const dashboardGameIds = gameBlock
  ? [...gameBlock[1].matchAll(/\{\s*id:\s*["']([^"']+)["']/g)].map((m) => m[1])
  : [];
const linkedGameIds = new Set();
if (gameBlock) {
  for (const objectMatch of gameBlock[1].matchAll(/\{([^{}]+)\}/g)) {
    const body = objectMatch[1];
    const id = body.match(/\bid:\s*["']([^"']+)["']/)?.[1];
    const link = body.match(/\blink:\s*["']([^"']+)["']/)?.[1];
    if (id && link) {
      linkedGameIds.add(id);
      assert(app.includes(`path="${link}"`) || app.includes(`path='${link}'`), `standalone game route registered: ${id} -> ${link}`);
    }
  }
}
const componentBlock = gamePage.match(/const gameComponents[^=]*=\s*\{([\s\S]*?)\n\};/);
const componentIds = new Set();
if (componentBlock) {
  for (const m of componentBlock[1].matchAll(/^\s*(?:["']([^"']+)["']|([A-Za-z0-9_-]+))\s*:/gm)) {
    componentIds.add(m[1] || m[2]);
  }
}
for (const id of dashboardGameIds) {
  assert(componentIds.has(id) || linkedGameIds.has(id), `dashboard game resolves: ${id}`);
}
assert(dashboardGameIds.length >= 25, `learning tool/game floor met (${dashboardGameIds.length} >= 25)`);

// Core navigable surfaces that exist in the production app. Keep this list tied
// to actual product routes so the gate catches accidental deletion rather than
// requiring invented/renamed pages.
const requiredRoutes = [
  '/dashboard', '/auth', '/pricing', '/path', '/sandbox', '/tutor', '/battle',
  '/analytics', '/profile', '/settings', '/leaderboard', '/avatar', '/install',
];
for (const route of requiredRoutes) {
  assert(app.includes(`path="${route}"`) || app.includes(`path='${route}'`), `route registered: ${route}`);
}
assert(/path=["']\/module\/:moduleId["']/.test(app), 'dynamic module route registered');
assert(/path=["']\/lesson\/:moduleId\/:lessonId["']/.test(app), 'dynamic lesson route registered');
assert(/path=["']\/game\/:gameId["']/.test(app), 'dynamic game route registered');
assert(/path=["']\/zone\/:zoneId["']/.test(app), 'dynamic zone route registered');

const reactMajor = String(pkg.dependencies?.react || '').match(/\d+/)?.[0];
const reactDomMajor = String(pkg.dependencies?.['react-dom'] || '').match(/\d+/)?.[0];
assert(Boolean(reactMajor && reactMajor === reactDomMajor), `React/react-dom major versions match (${reactMajor})`);
assert(pkg.scripts?.typecheck, 'typecheck script exists');
assert(pkg.scripts?.verify, 'full verification script exists');
assert(pkg.scripts?.['curriculum:validate'], 'curriculum validation script exists');

for (const sensitive of ['.env', 'android/app/keystore.properties', 'android/app/upload-keystore.jks']) {
  assert(!fs.existsSync(path.join(root, sensitive)), `secret/signing material absent: ${sensitive}`);
}
assert(gitignore.includes('.env'), '.env is gitignored');
assert(gitignore.includes('upload-keystore.jks'), 'Android upload keystore is gitignored');
assert(gitignore.includes('keystore.properties'), 'Android signing properties are gitignored');

console.log(`AIBLTYCODE completeness gate: ${pass.length} checks passed.`);
console.log(`Curriculum metadata lessons detected: ${lessonMetadataCount}`);
console.log(`Dashboard learning tools/games detected: ${dashboardGameIds.length}`);
console.log(`Required modules detected: ${requiredModules.length}`);

if (fail.length) {
  console.error(`\n${fail.length} check(s) failed:`);
  for (const message of fail) console.error(` - ${message}`);
  process.exit(1);
}

console.log('All curriculum, mastery, retention, routing, tool and secret-safety checks passed.');