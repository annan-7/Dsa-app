import { createTrace, windowState } from "../trace";

function frequencies(target: string[]) {
  const counts = new Map<string, number>();
  for (const char of target) counts.set(char, (counts.get(char) ?? 0) + 1);
  return counts;
}

export function generateMinimumWindowSubstringBruteForceSteps(source = "ADOBECODEBANC", target = "ABC") {
  const chars = Array.from(source);
  const requiredChars = Array.from(target);
  const required = frequencies(requiredChars);
  const { steps, add } = createTrace(chars);
  let bestLeft = -1;
  let bestLength = Infinity;
  add(1, "Check every start", "Start a fresh frequency count at each left boundary.", { action: "move" });
  if (requiredChars.length > 0) {
    for (let left = 0; left < chars.length; left++) {
      const counts = new Map<string, number>();
      let matched = 0;
      for (let right = left; right < chars.length; right++) {
        const char = chars[right];
        counts.set(char, (counts.get(char) ?? 0) + 1);
        if ((counts.get(char) ?? 0) <= (required.get(char) ?? 0)) matched++;
        add(2, "Extend candidate", `Include '${char}'; ${matched} of ${requiredChars.length} required characters are covered.`, {
          ...windowState(left, right), action: "compare", variables: { matched, required: requiredChars.length },
        });
        if (matched === requiredChars.length) {
          if (right - left + 1 < bestLength) {
            bestLeft = left;
            bestLength = right - left + 1;
          }
          add(3, "Complete candidate", "This is the shortest complete window for this start. Longer windows cannot improve it.", {
            ...windowState(left, right), action: "found", variables: { bestLength },
          });
          break;
        }
      }
    }
  }
  const result = bestLeft < 0 ? "" : chars.slice(bestLeft, bestLeft + bestLength).join("");
  add(4, "Return minimum window", result ? `The shortest covering window is '${result}'.` : "Return an empty string: no nonempty covering window is required or available.", {
    ...windowState(bestLeft, bestLeft < 0 ? -1 : bestLeft + bestLength - 1), action: result ? "found" : "skip", result,
    variables: { bestLength: bestLeft < 0 ? 0 : bestLength },
  });
  return steps;
}

export function generateMinimumWindowSubstringOptimizedSteps(source = "ADOBECODEBANC", target = "ABC") {
  const chars = Array.from(source);
  const requiredChars = Array.from(target);
  const required = frequencies(requiredChars);
  const counts = new Map<string, number>();
  const { steps, add } = createTrace(chars);
  let left = 0;
  let matched = 0;
  let bestLeft = -1;
  let bestLength = Infinity;
  add(1, "Initialize window", "Track required character frequencies, including duplicates.", { action: "move" });
  if (requiredChars.length > 0) {
    for (let right = 0; right < chars.length; right++) {
      const char = chars[right];
      counts.set(char, (counts.get(char) ?? 0) + 1);
      if ((counts.get(char) ?? 0) <= (required.get(char) ?? 0)) matched++;
      add(2, "Expand window", `Include '${char}'; ${matched} of ${requiredChars.length} required characters are covered.`, {
        ...windowState(left, right), action: "move", variables: { matched, required: requiredChars.length },
      });
      while (matched === requiredChars.length) {
        if (right - left + 1 < bestLength) {
          bestLeft = left;
          bestLength = right - left + 1;
        }
        add(3, "Record valid window", "All target frequencies are covered. Record the best length before shrinking.", {
          ...windowState(left, right), action: "found", variables: { bestLength, matched },
        });
        const leaving = chars[left];
        counts.set(leaving, (counts.get(leaving) ?? 0) - 1);
        if ((counts.get(leaving) ?? 0) < (required.get(leaving) ?? 0)) matched--;
        left++;
        add(4, "Shrink window", `Remove '${leaving}' and advance left. ${matched} required characters remain covered.`, {
          ...windowState(left, right), action: "move", variables: { left, matched, bestLength },
        });
      }
    }
  }
  const result = bestLeft < 0 ? "" : chars.slice(bestLeft, bestLeft + bestLength).join("");
  add(5, "Return minimum window", result ? `The shortest covering window is '${result}'.` : "Return an empty string: no nonempty covering window is required or available.", {
    ...windowState(bestLeft, bestLeft < 0 ? -1 : bestLeft + bestLength - 1), action: result ? "found" : "skip", result,
    variables: { bestLength: bestLeft < 0 ? 0 : bestLength },
  });
  return steps;
}
