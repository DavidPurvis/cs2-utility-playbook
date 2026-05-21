import { stripUtilityWords, toTokenSet } from "./text.js";

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

export function stringSimilarity(a, b) {
  const left = stripUtilityWords(a);
  const right = stripUtilityWords(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.85;
  return jaccard(toTokenSet(left), toTokenSet(right));
}

export function pairScore(left, right) {
  if (!left || !right) return 0;
  const fromScore = stringSimilarity(left.from, right.from);
  const toScore = stringSimilarity(left.to, right.to);
  const slugScore = stringSimilarity(left.slug, right.slug);
  const nameScore = stringSimilarity(left.name || left.title, right.name || right.title);

  const weighted = (fromScore * 0.45) + (toScore * 0.35) + (slugScore * 0.1) + (nameScore * 0.1);
  return Number(weighted.toFixed(4));
}

export function findBestCsnadesMatch(target, candidates, { minScore = 0.55, used = new Set() } = {}) {
  let bestIdx = -1;
  let bestScore = 0;

  for (let i = 0; i < candidates.length; i += 1) {
    if (used.has(i)) continue;
    const score = pairScore(target, candidates[i]);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  if (bestIdx === -1 || bestScore < minScore) return null;
  return { index: bestIdx, score: bestScore, record: candidates[bestIdx] };
}
