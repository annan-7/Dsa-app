import { createTrace } from "../trace";

export function generateValidAnagramBruteForceSteps(left = "anagram", right = "nagaram") {
  const first = Array.from(left).sort();
  const second = Array.from(right).sort();
  const { steps, add } = createTrace([...first, "|", ...second]);
  add(1, "Sort both strings", "Arrange both character lists in the same order, preserving duplicate letters.", { action: "calculate" });
  let result = first.length === second.length;
  add(2, "Compare lengths", result ? "Lengths match; compare corresponding sorted letters." : "Different lengths cannot be anagrams.", { action: "compare" });
  if (result) {
    for (let index = 0; index < first.length; index++) {
      const matches = first[index] === second[index];
      add(3, "Compare sorted characters", `'${first[index]}' ${matches ? "matches" : "differs from"} '${second[index]}'.`, {
        action: "compare", activeIndices: [index, first.length + 1 + index], pointers: { i: index, j: first.length + 1 + index },
      });
      if (!matches) { result = false; break; }
    }
  }
  add(4, "Return anagram check", result ? "Every sorted character matches: these strings are anagrams." : "The strings have different character frequencies.", { action: result ? "found" : "skip", result });
  return steps;
}

export function generateValidAnagramOptimizedSteps(left = "anagram", right = "nagaram") {
  const first = Array.from(left);
  const second = Array.from(right);
  const { steps, add } = createTrace([...first, "|", ...second]);
  const counts = new Map<string, number>();
  const snapshot = () => [...counts].map(([key, value]) => ({ key, value: String(value) }));
  add(1, "Initialize balances", "Add counts from the first string and subtract counts from the second.", { action: "move" });
  for (let index = 0; index < first.length; index++) {
    const char = first[index];
    counts.set(char, (counts.get(char) ?? 0) + 1);
    add(2, "Increment frequency", `Add '${char}'; its balance is ${counts.get(char)}.`, { action: "calculate", activeIndices: [index], hashMap: snapshot() });
  }
  for (let index = 0; index < second.length; index++) {
    const char = second[index];
    counts.set(char, (counts.get(char) ?? 0) - 1);
    add(3, "Decrement frequency", `Subtract '${char}'; its balance is ${counts.get(char)}.`, { action: "calculate", activeIndices: [first.length + 1 + index], hashMap: snapshot() });
  }
  const result = [...counts.values()].every(count => count === 0);
  add(4, "Return balance check", result ? "Every balance is zero: these strings are anagrams." : "A nonzero balance proves the strings are not anagrams.", { action: result ? "found" : "skip", result, hashMap: snapshot() });
  return steps;
}
