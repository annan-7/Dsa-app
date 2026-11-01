import { createTrace, windowState } from "../trace";

export function generateLongestSubstringBruteForceSteps(source = "abcabcbb") {
  const chars = Array.from(source);
  const { steps, add } = createTrace(chars);
  let best = 0;
  let bestLeft = -1;
  add(1, "Try every start", "Create a fresh set for each starting index.", { action: "move" });
  for (let left = 0; left < chars.length; left++) {
    const seen = new Set<string>();
    for (let right = left; right < chars.length; right++) {
      const duplicate = seen.has(chars[right]);
      add(2, duplicate ? "Duplicate found" : "Check next character", duplicate
        ? `'${chars[right]}' repeats. Every longer window from this start also repeats, so stop.`
        : `'${chars[right]}' is new in this candidate.`, { ...windowState(left, right), action: "compare" });
      if (duplicate) break;
      seen.add(chars[right]);
      if (right - left + 1 > best) {
        best = right - left + 1;
        bestLeft = left;
      }
      add(3, "Update best length", `This unique window has length ${right - left + 1}; best is ${best}.`, {
        ...windowState(left, right), action: "calculate", variables: { best },
      });
    }
  }
  add(4, "Return longest length", `The longest substring without repeated characters has length ${best}.`, {
    ...windowState(bestLeft, bestLeft + best - 1), action: "found", result: best, variables: { best },
  });
  return steps;
}

export function generateLongestSubstringOptimizedSteps(source = "abcabcbb") {
  const chars = Array.from(source);
  const { steps, add } = createTrace(chars);
  const seen = new Map<string, number>();
  let left = 0;
  let best = 0;
  let bestLeft = -1;
  add(1, "Initialize window", "Remember each character's latest index to skip duplicates.", { action: "move" });
  for (let right = 0; right < chars.length; right++) {
    const previous = seen.get(chars[right]);
    add(2, "Inspect character", `Inspect '${chars[right]}' at index ${right}.`, { ...windowState(left, right), action: "compare" });
    if (previous !== undefined && previous >= left) {
      left = previous + 1;
      add(3, "Skip duplicate", `Move left past the previous '${chars[right]}' at ${previous}. The window is unique again.`, {
        ...windowState(left, right), action: "move", variables: { left, previous },
      });
    }
    seen.set(chars[right], right);
    if (right - left + 1 > best) {
      best = right - left + 1;
      bestLeft = left;
    }
    add(4, "Update best length", `Remember index ${right}. Current length is ${right - left + 1}; best is ${best}.`, {
      ...windowState(left, right), action: "calculate", variables: { best },
    });
  }
  add(5, "Return longest length", `The longest substring without repeated characters has length ${best}.`, {
    ...windowState(bestLeft, bestLeft + best - 1), action: "found", result: best, variables: { best },
  });
  return steps;
}
