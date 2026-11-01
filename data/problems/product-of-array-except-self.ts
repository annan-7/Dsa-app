import type { ProblemDefinition } from "@/libs/types";
import { generateProductExceptSelfBruteForceSteps, generateProductExceptSelfOptimizedSteps } from "@/libs/Algorithms/Array&Hashing/product-of-array-except-self";

const brutePseudocode = [
  "for each output index",
  "  multiply all values at other indices",
  "return all products"
];

const optimizedPseudocode = [
  "initialize output to ones",
  "scan left to right: store prefix; update prefix",
  "scan right to left: multiply suffix; update suffix",
  "return output"
];

export const productOfArrayExceptSelfProblem: ProblemDefinition = {
	patternSlug: "array-and-hashing",
	problemSlug: "product-of-array-except-self",
	title: "Product of Array Except Self",
	description: "Return the product of all numbers except the current index without using division.",
	summary: "The brute force version multiplies every other element for each position. The optimized version uses prefix and suffix products to build the answer in linear time.",
	input: [1, 2, 3, 4],
	defaultMode: "optimized",
	visualization: "array",
	pseudocode: { brute: brutePseudocode, optimized: optimizedPseudocode },
	complexity: {
		brute: { time: "O(n^2)", space: "O(1)", detail: "Each output position scans the whole array again." },
		optimized: { time: "O(n)", space: "O(1)", detail: "Two linear passes build prefix and suffix products without division." },
	},
	steps: { brute: generateProductExceptSelfBruteForceSteps(), optimized: generateProductExceptSelfOptimizedSteps() },
};
