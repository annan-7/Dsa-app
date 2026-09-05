import type { ProblemDefinition } from "@/libs/types";
import { generateContainsDuplicateIIBruteForceSteps, generateContainsDuplicateIIOptimizedSteps } from "@/libs/Algorithms/SlidingWindow/contains-duplicate-ii";

export const containsDuplicateIIProblem: ProblemDefinition = {
	patternSlug: "sliding-window", problemSlug: "contains-duplicate-ii", title: "Contains Duplicate II",
	description: "Determine whether two equal values occur within k indices of each other.", summary: "A bounded window compares nearby pairs; a latest-index table finds qualifying duplicates in one pass.",
	input: [1, 2, 3, 1], target: 3, defaultMode: "optimized", visualization: "array",
	pseudocode: { brute: ["for each index:", "  compare values in the previous k positions", "  return true on a match"], optimized: ["lastSeen = {}", "for each index:", "  if value was seen within k: return true", "  store its latest index"] },
	complexity: { brute: { time: "O(nk)", space: "O(1)", detail: "Each index checks up to k nearby values." }, optimized: { time: "O(n)", space: "O(n)", detail: "A map stores the latest position of each value." } },
	steps: { brute: generateContainsDuplicateIIBruteForceSteps(), optimized: generateContainsDuplicateIIOptimizedSteps() },
};