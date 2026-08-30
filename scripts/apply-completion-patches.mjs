import fs from 'node:fs';

function patchFile(path, replacements) {
  let source = fs.readFileSync(path, 'utf8');
  let changed = false;

  for (const { oldText, newText, marker } of replacements) {
    if (source.includes(newText)) continue;
    if (!source.includes(oldText)) {
      throw new Error(`${path}: unable to find patch target: ${marker}`);
    }
    source = source.replace(oldText, newText);
    changed = true;
  }

  if (changed) fs.writeFileSync(path, source);
  return changed;
}

const changes = [];

if (patchFile('src/data/expandedMasteryGenerator.ts', [
  {
    marker: 'ES2020-compatible lesson id normalisation',
    oldText: 'const shortId = lessonId.replace(/^[a-z]+-/, "").replaceAll("-", " ");',
    newText: 'const shortId = lessonId.replace(/^[a-z]+-/, "").replace(/-/g, " ");',
  },
])) changes.push('src/data/expandedMasteryGenerator.ts');

if (patchFile('src/data/lessonGenerator.ts', [
  {
    marker: 'expanded mastery generator import',
    oldText: 'import { javaTopics7, systemsTopics7, mathsTopics7, cyberTopics7, aiTopics7, businessTopics7, gameTopics7, computerTopics7, webTopics7 } from "./topicKnowledge7";',
    newText: 'import { javaTopics7, systemsTopics7, mathsTopics7, cyberTopics7, aiTopics7, businessTopics7, gameTopics7, computerTopics7, webTopics7 } from "./topicKnowledge7";\nimport { generateExpandedMasterySteps } from "./expandedMasteryGenerator";',
  },
  {
    marker: 'expansion module categories',
    oldText: '    "web-technologies": "Web Technologies",\n  };',
    newText: '    "web-technologies": "Web Technologies",\n    "python-programming": "Python Programming",\n    "javascript-web": "JavaScript & Modern Web",\n    "ai-builder": "AI Builder",\n    "digital-marketing": "Digital Marketing & SEO",\n    "animation-motion": "Animation & Motion",\n    "software-tools": "Professional Software & IT",\n    "project-delivery": "Project Delivery",\n  };',
  },
  {
    marker: 'subject-aware mastery generation',
    oldText: '  const known = masteryKnowledgeBase[id];\n  if (known) return buildMasterySteps(known);\n  if (moduleId === "java-foundations") return generateJavaSteps(id, title, desc);',
    newText: '  const known = masteryKnowledgeBase[id];\n  if (known) return buildMasterySteps(known);\n\n  const expandedSteps = generateExpandedMasterySteps(id, title, desc, moduleId);\n  if (expandedSteps) return expandedSteps;\n\n  if (moduleId === "java-foundations") return generateJavaSteps(id, title, desc);',
  },
])) changes.push('src/data/lessonGenerator.ts');

if (patchFile('src/pages/Dashboard.tsx', [
  {
    marker: 'dynamic module continuation threshold',
    oldText: '              const nextModule = moduleOrder.find(m => {\n                const done = progress.filter(p => p.moduleId === m && p.completed).length;\n                return done > 0 && done < 50;\n              }) || moduleOrder.find(m => progress.filter(p => p.moduleId === m && p.completed).length === 0) || "java-foundations";',
    newText: '              const nextModule = moduleOrder.find(m => {\n                const done = progress.filter(p => p.moduleId === m && p.completed).length;\n                const total = moduleLessons[m]?.length ?? 0;\n                return done > 0 && total > 0 && done < total;\n              }) || moduleOrder.find(m => {\n                const total = moduleLessons[m]?.length ?? 0;\n                return total > 0 && progress.filter(p => p.moduleId === m && p.completed).length === 0;\n              }) || "java-foundations";',
  },
])) changes.push('src/pages/Dashboard.tsx');

if (changes.length === 0) {
  console.log('Completion patches already applied.');
} else {
  console.log(`Applied completion patches to: ${changes.join(', ')}`);
}
