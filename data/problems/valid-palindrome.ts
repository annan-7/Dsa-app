import type { ProblemDefinition } from "@/libs/types";
import {
	generateValidPalindromeBruteForceSteps,
	generateValidPalindromeOptimizedSteps,
} from "@/libs/Algorithms/TwoPointer/valid-palindrome";

const brutePseudocode = [
	"clean = filter alphanumeric chars",
	"return clean == reverse(clean)",
];

const optimizedPseudocode = [
	"left = 0, right = n - 1",
	"while left < right:",
	"  skip non-alphanumeric characters",
	"  compare chars[left] and chars[right]",
	"  if mismatch: return false",
	"  move both pointers inward",
];

export const validPalindromeProblem: ProblemDefinition = {
	patternSlug: "two-pointers",
	problemSlug: "valid-palindrome",
	title: "Valid Palindrome",
	description: "Check whether a string reads the same forward and backward after ignoring punctuation.",
	summary: "The brute force path normalizes the string and compares it to its reverse, while the optimized path uses two pointers and skips noise in place.",
	input: "A man, a plan, a canal: Panama".split(""),
	defaultMode: "optimized",
	visualization: "array",
	pseudocode: {
		brute: brutePseudocode,
		optimized: optimizedPseudocode,
	},
	complexity: {
		brute: {
			time: "O(n)",
			space: "O(n)",
			detail: "Cleaning and reversing the string require additional space for the filtered copy.",
		},
		optimized: {
			time: "O(n)",
			space: "O(1)",
			detail: "Two pointers skip irrelevant characters in place, so no extra filtered copy is needed.",
		},
	},
	steps: {
		brute: generateValidPalindromeBruteForceSteps(),
		optimized: generateValidPalindromeOptimizedSteps(),
	},
};
