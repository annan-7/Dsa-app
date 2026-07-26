import { containerWithMostWaterProblem } from "@/data/problems/container-with-most-water";
import { longestSubstringWithoutRepeatingCharactersProblem } from "@/data/problems/longest-substring-without-repeating-characters";
import { minimumWindowSubstringProblem } from "@/data/problems/minimum-window-substring";
import { productOfArrayExceptSelfProblem } from "@/data/problems/product-of-array-except-self";
import { threeSumProblem } from "@/data/problems/three-sum";
import { twoSumIIProblem } from "@/data/problems/two-sum-ii";
import { twoSumProblem } from "@/data/problems/two-sum";
import { validPalindromeProblem } from "@/data/problems/valid-palindrome";
import { validParenthesesProblem } from "@/data/problems/valid-parentheses";

export const problemRegistry = {
	[containerWithMostWaterProblem.problemSlug]: containerWithMostWaterProblem,
	[longestSubstringWithoutRepeatingCharactersProblem.problemSlug]: longestSubstringWithoutRepeatingCharactersProblem,
	[minimumWindowSubstringProblem.problemSlug]: minimumWindowSubstringProblem,
	[productOfArrayExceptSelfProblem.problemSlug]: productOfArrayExceptSelfProblem,
	[threeSumProblem.problemSlug]: threeSumProblem,
	[twoSumProblem.problemSlug]: twoSumProblem,
	[twoSumIIProblem.problemSlug]: twoSumIIProblem,
	[validPalindromeProblem.problemSlug]: validPalindromeProblem,
	[validParenthesesProblem.problemSlug]: validParenthesesProblem,
} as const;

export const problemList = [
	twoSumIIProblem,
	threeSumProblem,
	validPalindromeProblem,
	containerWithMostWaterProblem,
	longestSubstringWithoutRepeatingCharactersProblem,
	minimumWindowSubstringProblem,
	twoSumProblem,
	productOfArrayExceptSelfProblem,
	validParenthesesProblem,
];