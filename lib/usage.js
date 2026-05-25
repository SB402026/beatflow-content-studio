// Usage keys stored in localStorage as JSON
// Structure: { "2025-05-25": { beatTitles: 1, youtubeSEO: 0, ... } }

export const TOOL_KEYS = ["beatTitles", "youtubeSEO", "socialCaptions", "bioWriter", "pricingCopy"];
export const FREE_LIMIT = 1; // per tool per day

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getUsage() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("bf_usage");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveUsage(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bf_usage", JSON.stringify(data));
}

export function getToolCount(toolKey) {
  const usage = getUsage();
  const day   = todayKey();
  return usage?.[day]?.[toolKey] ?? 0;
}

export function canUse(toolKey, isPro) {
  if (isPro) return true;
  return getToolCount(toolKey) < FREE_LIMIT;
}

export function recordUse(toolKey) {
  const usage = getUsage();
  const day   = todayKey();
  if (!usage[day]) usage[day] = {};
  usage[day][toolKey] = (usage[day][toolKey] ?? 0) + 1;
  // Prune old days (keep only last 2)
  const days = Object.keys(usage).sort();
  if (days.length > 2) delete usage[days[0]];
  saveUsage(usage);
}

export function getRemainingAll(isPro) {
  if (isPro) return TOOL_KEYS.reduce((a, k) => ({ ...a, [k]: Infinity }), {});
  return TOOL_KEYS.reduce((a, k) => ({ ...a, [k]: Math.max(0, FREE_LIMIT - getToolCount(k)) }), {});
}
