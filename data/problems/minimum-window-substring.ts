import type { ProblemDefinition } from "@/libs/types";
import { generateMinimumWindowSubstringBruteForceSteps, generateMinimumWindowSubstringOptimizedSteps } from "@/libs/Algorithms/SlidingWindow/minimum-window-substring";

const brutePseudocode = [
  "for each left: reset counts and matched",
  "  extend right; update counts and matched",
  "  if covered: update best and stop this start",
  "return shortest window or empty string"
];

const optimizedPseudocode = [
  "left = matched = 0; count required characters",
  "for each right: add character and update matched",
  "  while covered: record shortest window",
  "    remove left character; advance left",
  "return shortest window or empty string"
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
	complexity: { brute: { time: "O(n² + m)", space: "O(n + m)", detail: "Each start extends a candidate while incrementally tracking coverage, including duplicate target characters." }, optimized: { time: "O(n + m)", space: "O(n + m)", detail: "Each source character enters and leaves once; initializing target frequencies costs O(m)." } },
	steps: { brute: generateMinimumWindowSubstringBruteForceSteps(), optimized: generateMinimumWindowSubstringOptimizedSteps() },
};
