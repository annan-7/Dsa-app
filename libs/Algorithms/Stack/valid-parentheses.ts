import { createTrace } from "../trace";

const matching: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
function validate(expression: string) {
  if (!/^[()[\]{}]*$/.test(expression)) throw new Error("Only parentheses, square brackets, and braces are supported.");
}

export function generateValidParenthesesBruteForceSteps(expression = "({[]})") {
  validate(expression);
  let remaining = expression.split("");
  const { steps, add } = createTrace(remaining);
  add(1, "Reduce adjacent pairs", "Repeatedly scan for an adjacent matching pair. This approach does not use a stack.", { action: "move" });
  while (remaining.length > 0) {
    let removed = false;
    for (let index = 0; index + 1 < remaining.length; index++) {
      const pairMatches = matching[remaining[index + 1]] === remaining[index];
      add(2, "Compare adjacent brackets", `Check '${remaining[index]}${remaining[index + 1]}': ${pairMatches ? "matching pair" : "not removable"}.`, {
        array: [...remaining], activeIndices: [index, index + 1], pointers: { i: index, j: index + 1 }, action: "compare",
      });
      if (pairMatches) {
        remaining = [...remaining.slice(0, index), ...remaining.slice(index + 2)];
        add(3, "Remove pair", "Remove the pair and restart the scan because new adjacent pairs may now exist.", {
          array: [...remaining], action: "move", variables: { remaining: remaining.join("") || "(empty)" },
        });
        removed = true;
        break;
      }
    }
    if (!removed) break;
  }
  const result = remaining.length === 0;
  add(4, "Return reduction result", result ? "No brackets remain, so the expression is balanced." : "Unmatched brackets remain and no pair can be removed.", {
    array: [...remaining], action: result ? "found" : "skip", result,
  });
  return steps;
}

export function generateValidParenthesesOptimizedSteps(expression = "({[]})") {
  validate(expression);
  const tokens = expression.split("");
  const { steps, add } = createTrace(tokens);
  const stack: string[] = [];
  add(1, "Initialize stack", "Match each closing bracket with the most recent unmatched opener.", { stack: [], action: "move" });
  for (let index = 0; index < tokens.length; index++) {
    const char = tokens[index];
    const position = { activeIndices: [index], currentIndex: index, currentChar: char };
    if ("([{".includes(char)) {
      stack.push(char);
      add(2, "Push opener", `Push '${char}' onto the stack.`, { ...position, stack: [...stack], action: "move" });
    } else {
      const top = stack.at(-1);
      add(3, "Compare stack top", `Closing '${char}' needs '${matching[char]}'; the top is '${top ?? "empty"}'.`, { ...position, stack: [...stack], action: "compare" });
      if (top !== matching[char]) {
        add(4, "Return false", "The closing bracket has no matching opener on top.", { ...position, stack: [...stack], action: "skip", result: false });
        return steps;
      }
      stack.pop();
      add(5, "Pop matched opener", `Remove '${top}' after matching '${char}'.`, { ...position, stack: [...stack], action: "move" });
    }
  }
  const result = stack.length === 0;
  add(6, "Return stack check", result ? "The stack is empty: every bracket matched." : "Opening brackets remain unmatched in the stack.", { stack: [...stack], action: result ? "found" : "skip", result });
  return steps;
}
