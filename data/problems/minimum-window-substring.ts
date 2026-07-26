import type { ProblemDefinition } from "@/libs/types";
import { generateMinimumWindowSubstringBruteForceSteps, generateMinimumWindowSubstringOptimizedSteps } from "@/libs/Algorithms/SlidingWindow/minimum-window-substring";

const brutePseudocode = [
	"check every substring",
	"keep the shortest one that covers target",
];

const optimizedPseudocode = [
	"expand right until target is covered",
	"shrink left while still valid",
	"record the smallest valid window",
];

export const minimumWindowSubstringProblem: ProblemDefinition = {
	patternSlug: "sliding-window",
	problemSlug: "minimum-window-substring",
	title: "Minimum Window Substring",
	description: "Find the shortest substring of s that contains every character in t.",
	summary: "Brute force checks every window. The optimized version expands and shrinks a sliding window while tracking how many target characters are covered.",
	input: "ADOBECODEBANC".split(""),
	target: "ABC",
	defaultMode: "optimized",
	visualization: "array",
	pseudocode: { brute: brutePseudocode, optimized: optimizedPseudocode },
	complexity: { brute: { time: "O(n^3)", space: "O(n)", detail: "Every substring is validated against the target set." }, optimized: { time: "O(n)", space: "O(n)", detail: "The sliding window expands and contracts once per character on average." } },
	steps: { brute: generateMinimumWindowSubstringBruteForceSteps(), optimized: generateMinimumWindowSubstringOptimizedSteps() },
};
