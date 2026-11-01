import { createTrace } from "../trace";

function isAlphaNumeric(value: string) { return /^[a-z0-9]$/i.test(value); }

export function generateValidPalindromeBruteForceSteps(phrase = "A man, a plan, a canal: Panama") {
  const chars = phrase.split("");
  const cleaned = chars.filter(isAlphaNumeric).map(char => char.toLowerCase());
  const reversed = [...cleaned].reverse();
  const { steps, add } = createTrace(cleaned);
  add(1, "Normalize string", "Remove punctuation and lowercase ASCII letters before comparison.", { action: "calculate" });
  add(2, "Reverse a copy", `The reversed copy is '${reversed.join("")}'.`, { action: "calculate" });
  let result = true;
  for (let index = 0; index < cleaned.length; index++) {
    add(3, "Compare reversed copy", `Compare '${cleaned[index]}' with reversed character '${reversed[index]}'.`, { action: "compare", activeIndices: [index], pointers: { i: index } });
    if (cleaned[index] !== reversed[index]) { result = false; break; }
  }
  add(4, "Return palindrome check", result ? "All characters match their reversed copy." : "A reversed character differs, so this is not a palindrome.", { action: result ? "found" : "skip", result });
  return steps;
}

export function generateValidPalindromeOptimizedSteps(phrase = "A man, a plan, a canal: Panama") {
  const chars = phrase.split("");
  const { steps, add } = createTrace(chars);
  let left = 0;
  let right = phrase.length - 1;
  add(1, "Initialize two pointers", "Compare ASCII letters and digits from opposite ends, ignoring punctuation.", { action: "move" });
  while (left < right) {
    const position = { activeIndices: [left, right], pointers: { left, right } };
    if (!isAlphaNumeric(phrase[left])) {
      add(2, "Skip left punctuation", `Ignore '${phrase[left]}' and advance left.`, { ...position, action: "skip" });
      left++;
    } else if (!isAlphaNumeric(phrase[right])) {
      add(2, "Skip right punctuation", `Ignore '${phrase[right]}' and move right inward.`, { ...position, action: "skip" });
      right--;
    } else {
      add(3, "Compare mirrored characters", `Compare '${phrase[left].toLowerCase()}' with '${phrase[right].toLowerCase()}'.`, { ...position, action: "compare" });
      if (phrase[left].toLowerCase() !== phrase[right].toLowerCase()) {
        add(4, "Return false", "Mirrored characters differ, so this is not a palindrome.", { ...position, action: "skip", result: false });
        return steps;
      }
      add(5, "Move inward", "The characters match. Advance both pointers toward the middle.", { ...position, action: "move" });
      left++;
      right--;
    }
  }
  add(6, "Return true", "All mirrored alphanumeric characters match.", { action: "found", result: true });
  return steps;
}
