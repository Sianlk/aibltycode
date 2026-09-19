// Maps every curriculum module to the zone and practice games it unlocks.
// Used by the Games tab, module pages and the learning path so lessons lead
// straight into real playable practice.

export interface ModuleGameLink {
  zoneId: string;
  games: string[];
  /** Lessons completed in the module needed before each extra game unlocks. */
  unlockEvery: number;
}

export const moduleGameMap: Record<string, ModuleGameLink> = {
  "java-foundations": { zoneId: "logic-district", games: ["typing", "ordering", "pattern", "debugging", "structure-builder"], unlockEvery: 3 },
  "systems-analysis": { zoneId: "dev-studio", games: ["use-case", "project-planner", "draw-io", "plantuml"], unlockEvery: 3 },
  "math-computing": { zoneId: "algorithm-arcade", games: ["complexity-arcade", "number-systems", "speed", "pacman"], unlockEvery: 3 },
  cybersecurity: { zoneId: "security-sector", games: ["cybersecurity", "system-design", "subnetting"], unlockEvery: 3 },
  "ai-data-science": { zoneId: "ai-lab", games: ["ai-data", "graph-visualizer", "spaced-rep", "flashcards"], unlockEvery: 3 },
  "business-systems": { zoneId: "data-city", games: ["excel-master", "erd-builder", "sql-query", "draw-io"], unlockEvery: 3 },
  "game-development": { zoneId: "dev-studio", games: ["game-dev", "pacman", "pattern", "puzzle-builder"], unlockEvery: 3 },
  "computer-systems": { zoneId: "office-tower", games: ["pc-builder", "lmc-simulator", "subnetting", "network-protocols", "number-systems"], unlockEvery: 3 },
  "web-technologies": { zoneId: "web-forge", games: ["html-css", "typing", "puzzle-builder", "debugging"], unlockEvery: 3 },

  // New modules
  "python-programming": { zoneId: "script-lab", games: ["typing", "debugging", "ordering", "pattern", "puzzle-builder"], unlockEvery: 3 },
  "javascript-web": { zoneId: "web-forge", games: ["html-css", "typing", "puzzle-builder", "debugging"], unlockEvery: 3 },
  "ai-builder": { zoneId: "ai-forge", games: ["chatbot-builder", "ai-data", "flashcards", "spaced-rep"], unlockEvery: 2 },
  "digital-marketing": { zoneId: "data-city", games: ["graph-visualizer", "excel-master", "flashcards"], unlockEvery: 3 },
  "animation-motion": { zoneId: "motion-studio", games: ["html-css", "pattern", "flashcards"], unlockEvery: 3 },
  "software-tools": { zoneId: "office-tower", games: ["excel-master", "sql-query", "pc-builder", "subnetting", "network-protocols"], unlockEvery: 3 },
  "project-delivery": { zoneId: "dev-studio", games: ["project-planner", "use-case", "draw-io", "plantuml"], unlockEvery: 3 },
};

export function getModuleGames(moduleId: string): string[] {
  return moduleGameMap[moduleId]?.games ?? [];
}

export function getModuleZone(moduleId: string): string | undefined {
  return moduleGameMap[moduleId]?.zoneId;
}

/** Modules whose lessons feed a given game. */
export function getModulesForGame(gameId: string): string[] {
  return Object.entries(moduleGameMap)
    .filter(([, link]) => link.games.includes(gameId))
    .map(([moduleId]) => moduleId);
}

/**
 * Which games a learner has unlocked in a module.
 * The first game is always open; each further game unlocks after more lessons.
 */
export function unlockedModuleGames(moduleId: string, lessonsCompleted: number): string[] {
  const link = moduleGameMap[moduleId];
  if (!link) return [];
  const unlockedCount = 1 + Math.floor(lessonsCompleted / link.unlockEvery);
  return link.games.slice(0, Math.max(1, Math.min(unlockedCount, link.games.length)));
}

export function nextGameUnlockAt(moduleId: string, lessonsCompleted: number): number | null {
  const link = moduleGameMap[moduleId];
  if (!link) return null;
  const unlocked = unlockedModuleGames(moduleId, lessonsCompleted).length;
  if (unlocked >= link.games.length) return null;
  return unlocked * link.unlockEvery;
}

/** Courses that feed a zone. */
export function getZoneModules(zoneId: string): string[] {
  return Object.entries(moduleGameMap)
    .filter(([, link]) => link.zoneId === zoneId)
    .map(([moduleId]) => moduleId);
}

/** Zones that are open before any lesson is completed, so a new learner can start. */
export const starterZones = ["logic-district", "script-lab", "web-forge"];

export interface ZoneState {
  unlocked: boolean;
  percent: number;
  lessonsDone: number;
  lessonsTotal: number;
  /** Course whose first lesson opens this zone (when locked). */
  gateModuleId?: string;
}

/**
 * Real zone state from lesson progress: a zone opens as soon as the learner
 * completes a lesson in any course mapped to it, and its progress bar tracks
 * how much of those courses is done.
 */
export function getZoneState(
  zoneId: string,
  completedByModule: Record<string, number>,
  totalByModule: Record<string, number>,
): ZoneState {
  const mods = getZoneModules(zoneId);
  const lessonsDone = mods.reduce((n, m) => n + (completedByModule[m] ?? 0), 0);
  const lessonsTotal = mods.reduce((n, m) => n + (totalByModule[m] ?? 0), 0);
  return {
    unlocked: lessonsDone > 0 || starterZones.includes(zoneId),
    percent: lessonsTotal > 0 ? Math.round((lessonsDone / lessonsTotal) * 100) : 0,
    lessonsDone,
    lessonsTotal,
    gateModuleId: mods[0],
  };
}
