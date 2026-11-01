import type { ProblemDefinition } from "@/libs/types";
import { generateValidParenthesesBruteForceSteps, generateValidParenthesesOptimizedSteps } from "@/libs/Algorithms/Stack/valid-parentheses";

const brutePseudocode = [
  "while brackets remain:",
  "  scan for an adjacent matching pair",
  "  remove pair and restart; stop if no pair exists",
  "return whether remaining string is empty"
];

const optimizedPseudocode = [
  "stack = empty",
  "for each opener: push onto stack",
  "for each closer: compare with stack top",
  "  if mismatched: return false",
  "  otherwise: pop matching opener",
  "return whether stack is empty"
];

export const validParenthesesProblem: ProblemDefinition = {
	patternSlug: "stack",
	problemSlug: "valid-parentheses",
	title: "Valid Parentheses",
	description: "Check whether brackets are properly nested and closed.",
	summary: "The brute path models repeated reductions, while the optimized version uses a stack to match each closing bracket against the latest opener.",
	input: "({[]})".split(""),
	defaultMode: "optimized",
	visualization: "stack",
	pseudocode: {
		brute: brutePseudocode,
		optimized: optimizedPseudocode,
	},
	complexity: {
		brute: { time: "O(n^2)", space: "O(n)", detail: "Repeated reductions may rescan the string several times." },
		optimized: { time: "O(n)", space: "O(n)", detail: "Each bracket is processed once using a stack." },
	},
	steps: { brute: generateValidParenthesesBruteForceSteps(), optimized: generateValidParenthesesOptimizedSteps() },
};
