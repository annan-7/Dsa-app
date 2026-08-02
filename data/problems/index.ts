import { containerWithMostWaterProblem } from "@/data/problems/container-with-most-water";
import { containsDuplicateProblem } from "@/data/problems/contains-duplicate";
import { longestSubstringWithoutRepeatingCharactersProblem } from "@/data/problems/longest-substring-without-repeating-characters";
import { longestRepeatingCharacterReplacementProblem } from "@/data/problems/longest-repeating-character-replacement";
import { minimumWindowSubstringProblem } from "@/data/problems/minimum-window-substring";
import { productOfArrayExceptSelfProblem } from "@/data/problems/product-of-array-except-self";
import { searchInsertPositionProblem } from "@/data/problems/search-insert-position";
import { threeSumProblem } from "@/data/problems/three-sum";
import { twoSumIIProblem } from "@/data/problems/two-sum-ii";
import { twoSumProblem } from "@/data/problems/two-sum";
import { validAnagramProblem } from "@/data/problems/valid-anagram";
import { validPalindromeProblem } from "@/data/problems/valid-palindrome";
import { validParenthesesProblem } from "@/data/problems/valid-parentheses";

export const problemRegistry = {
	[containerWithMostWaterProblem.problemSlug]: containerWithMostWaterProblem,
	[containsDuplicateProblem.problemSlug]: containsDuplicateProblem,
	[longestSubstringWithoutRepeatingCharactersProblem.problemSlug]: longestSubstringWithoutRepeatingCharactersProblem,
	[longestRepeatingCharacterReplacementProblem.problemSlug]: longestRepeatingCharacterReplacementProblem,
	[minimumWindowSubstringProblem.problemSlug]: minimumWindowSubstringProblem,
	[productOfArrayExceptSelfProblem.problemSlug]: productOfArrayExceptSelfProblem,
	[searchInsertPositionProblem.problemSlug]: searchInsertPositionProblem,
	[threeSumProblem.problemSlug]: threeSumProblem,
	[twoSumProblem.problemSlug]: twoSumProblem,
	[twoSumIIProblem.problemSlug]: twoSumIIProblem,
	[validAnagramProblem.problemSlug]: validAnagramProblem,
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
	containsDuplicateProblem,
	validAnagramProblem,
	longestRepeatingCharacterReplacementProblem,
	searchInsertPositionProblem,
];