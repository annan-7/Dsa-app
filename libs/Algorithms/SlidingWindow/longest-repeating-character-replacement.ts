import { createTrace, windowState } from "../trace";

function validate(source: string, k: number) {
  if (!/^[A-Z]*$/.test(source) || !Number.isSafeInteger(k) || k < 0) {
    throw new Error("Use uppercase A–Z characters and a nonnegative integer replacement limit.");
  }
}

export function generateLongestRepeatingCharacterReplacementBruteForceSteps(source = "AABABBA", k = 1) {
  validate(source, k);
  const chars = source.split("");
  const { steps, add } = createTrace(chars);
  let best = 0;
  let bestLeft = -1;
  add(1, "Try every start", "Reset character counts for each starting position.", { action: "move", variables: { k } });
  for (let left = 0; left < chars.length; left++) {
    const counts = new Map<string, number>();
    let mostFrequent = 0;
    for (let right = left; right < chars.length; right++) {
      counts.set(chars[right], (counts.get(chars[right]) ?? 0) + 1);
      mostFrequent = Math.max(mostFrequent, counts.get(chars[right])!);
      const replacements = right - left + 1 - mostFrequent;
      add(2, "Evaluate candidate", `Length minus the most frequent count is ${replacements}; limit is ${k}.`, {
        ...windowState(left, right), action: "compare", variables: { mostFrequent, replacements, k },
      });
      if (replacements <= k && right - left + 1 > best) {
        best = right - left + 1;
        bestLeft = left;
        add(3, "Record best window", `This window can be made uniform with ${replacements} changes. Best length is ${best}.`, {
          ...windowState(left, right), action: "found", variables: { best },
        });
      }
    }
  }
  add(4, "Return longest length", `The longest valid window has length ${best}.`, {
    ...windowState(bestLeft, bestLeft + best - 1), action: "found", result: best, variables: { best },
  });
  return steps;
}

export function generateLongestRepeatingCharacterReplacementOptimizedSteps(source = "AABABBA", k = 1) {
  validate(source, k);
  const chars = source.split("");
  const { steps, add } = createTrace(chars);
  const counts = new Map<string, number>();
  let left = 0;
  let best = 0;
  let bestLeft = -1;
  add(1, "Initialize window", "Track at most 26 uppercase character counts and the replacement limit.", { action: "move", variables: { k } });
  for (let right = 0; right < chars.length; right++) {
    counts.set(chars[right], (counts.get(chars[right]) ?? 0) + 1);
    let mostFrequent = Math.max(...counts.values());
    add(2, "Expand window", `Add '${chars[right]}'. The largest current frequency is ${mostFrequent}.`, {
      ...windowState(left, right), action: "move", variables: { mostFrequent, replacements: right - left + 1 - mostFrequent, k },
    });
    while (right - left + 1 - mostFrequent > k) {
      const leaving = chars[left];
      counts.set(leaving, counts.get(leaving)! - 1);
      left++;
      mostFrequent = Math.max(...counts.values());
      add(3, "Shrink invalid window", `Remove '${leaving}' and recompute the largest frequency across at most 26 letters.`, {
        ...windowState(left, right), action: "move", variables: { mostFrequent, replacements: right - left + 1 - mostFrequent, k },
      });
    }
    if (right - left + 1 > best) {
      best = right - left + 1;
      bestLeft = left;
    }
    add(4, "Record valid length", `This window needs at most ${k} replacements. Best length remains ${best}.`, {
      ...windowState(left, right), action: "calculate", variables: { best },
    });
  }
  add(5, "Return longest length", `The longest valid window has length ${best}.`, {
    ...windowState(bestLeft, bestLeft + best - 1), action: "found", result: best, variables: { best },
  });
  return steps;
}
