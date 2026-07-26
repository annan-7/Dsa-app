import type { PatternDefinition } from "@/libs/types";
import { containerWithMostWaterProblem } from "@/data/problems/container-with-most-water";
import { longestSubstringWithoutRepeatingCharactersProblem } from "@/data/problems/longest-substring-without-repeating-characters";
import { minimumWindowSubstringProblem } from "@/data/problems/minimum-window-substring";
import { productOfArrayExceptSelfProblem } from "@/data/problems/product-of-array-except-self";
import { threeSumProblem } from "@/data/problems/three-sum";
import { twoSumIIProblem } from "@/data/problems/two-sum-ii";
import { twoSumProblem } from "@/data/problems/two-sum";
import { validPalindromeProblem } from "@/data/problems/valid-palindrome";
import { validParenthesesProblem } from "@/data/problems/valid-parentheses";

export const patterns: PatternDefinition[] = [
  {
    slug: "two-pointers",
    name: "Two Pointers",
    description: "Shrink the search space by moving pointers from both ends.",
    problems: [
      {
        slug: twoSumIIProblem.problemSlug,
        title: twoSumIIProblem.title,
        description: twoSumIIProblem.description,
        available: true,
      },
      {
        slug: validPalindromeProblem.problemSlug,
        title: validPalindromeProblem.title,
        description: validPalindromeProblem.description,
        available: true,
      },
      {
        slug: containerWithMostWaterProblem.problemSlug,
        title: containerWithMostWaterProblem.title,
        description: containerWithMostWaterProblem.description,
        available: true,
      },
      {
        slug: threeSumProblem.problemSlug,
        title: threeSumProblem.title,
        description: threeSumProblem.description,
        available: true,
      },
      {
        slug: "container-with-most-water",
        title: "Container With Most Water",
        description: "Maximize area with two boundary pointers.",
        available: false,
      },
    ],
  },
  {
    slug: "sliding-window",
    name: "Sliding Window",
    description: "Keep a moving window over contiguous sections.",
    problems: [
      {
        slug: longestSubstringWithoutRepeatingCharactersProblem.problemSlug,
        title: longestSubstringWithoutRepeatingCharactersProblem.title,
        description: longestSubstringWithoutRepeatingCharactersProblem.description,
        available: true,
      },
      {
        slug: minimumWindowSubstringProblem.problemSlug,
        title: minimumWindowSubstringProblem.title,
        description: minimumWindowSubstringProblem.description,
        available: true,
      },
    ],
  },
  {
    slug: "array-and-hashing",
    name: "Arrays & Hashing",
    description: "Blend indexed scans with constant-time lookups.",
    problems: [
      {
        slug: twoSumProblem.problemSlug,
        title: twoSumProblem.title,
        description: twoSumProblem.description,
        available: true,
      },
      {
        slug: productOfArrayExceptSelfProblem.problemSlug,
        title: productOfArrayExceptSelfProblem.title,
        description: productOfArrayExceptSelfProblem.description,
        available: true,
      },
    ],
  },
  {
    slug: "stack",
    name: "Stack",
    description: "Use LIFO state to match nested structure.",
    problems: [
      {
        slug: validParenthesesProblem.problemSlug,
        title: validParenthesesProblem.title,
        description: validParenthesesProblem.description,
        available: true,
      },
    ],
  },
  {
    slug: "binary-search",
    name: "Binary Search",
    description: "Cut the search interval in half each step.",
    problems: [
      {
        slug: "search-insert-position",
        title: "Search Insert Position",
        description: "Locate the insertion point in a sorted array.",
        available: false,
      },
    ],
  },
];