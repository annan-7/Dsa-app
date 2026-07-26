import type { ProblemDefinition } from "@/libs/types";
import { generateValidParenthesesBruteForceSteps, generateValidParenthesesOptimizedSteps } from "@/libs/Algorithms/Stack/valid-parentheses";

const brutePseudocode = [
	"repeat while changes exist:",
	"  remove matching pairs",
	"return stack/string empty",
];

const optimizedPseudocode = [
	"for char in s:",
	"  if opener: push",
	"  else if stack top matches: pop",
	"  else: return false",
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
