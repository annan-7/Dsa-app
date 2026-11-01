import { test } from "node:test";
import assert from "node:assert/strict";
import type { AlgorithmStep } from "../libs/types";
import { problemList } from "../data/problems";
import { generateMinimumWindowSubstringBruteForceSteps as minBrute, generateMinimumWindowSubstringOptimizedSteps as minFast } from "../libs/Algorithms/SlidingWindow/minimum-window-substring";
import { generateLongestSubstringBruteForceSteps as uniqueBrute, generateLongestSubstringOptimizedSteps as uniqueFast } from "../libs/Algorithms/SlidingWindow/longest-substring-without-repeating-characters";
import { generateLongestRepeatingCharacterReplacementBruteForceSteps as replaceBrute, generateLongestRepeatingCharacterReplacementOptimizedSteps as replaceFast } from "../libs/Algorithms/SlidingWindow/longest-repeating-character-replacement";
import { generateValidAnagramBruteForceSteps as anagramBrute, generateValidAnagramOptimizedSteps as anagramFast } from "../libs/Algorithms/Array&Hashing/valid-anagram";
import { generateValidParenthesesBruteForceSteps as bracketsBrute, generateValidParenthesesOptimizedSteps as bracketsFast } from "../libs/Algorithms/Stack/valid-parentheses";
import { generateValidPalindromeBruteForceSteps as palindromeBrute, generateValidPalindromeOptimizedSteps as palindromeFast } from "../libs/Algorithms/TwoPointer/valid-palindrome";

function validateSteps(steps: AlgorithmStep[], lines: number) {
  assert.ok(steps.length > 0);
  assert.equal(new Set(steps.map(step => step.id)).size, steps.length, "step ids must be unique");
  for (const step of steps) {
    assert.ok(step.message.length > 0);
    assert.ok(step.codeLine >= 1 && step.codeLine <= lines, `${step.id}: line ${step.codeLine} exceeds ${lines}`);
    for (const index of [...step.activeIndices, ...step.foundIndices, ...Object.values(step.pointers)]) {
      if (index !== undefined) assert.ok(Number.isInteger(index) && index >= 0 && index < step.array.length, `${step.id}: invalid index ${index}`);
    }
    if (step.windowRange) {
      const [left, right] = step.windowRange;
      assert.ok(left >= 0 && right >= left && right < step.array.length);
      assert.equal(step.windowLength, right - left + 1);
    }
  }
}
function result(steps: AlgorithmStep[], lines: number) {
  validateSteps(steps, lines);
  return steps.at(-1)!.result;
}
function words(alphabet: string, max: number): string[] {
  const all = [""];
  let layer = [""];
  for (let length = 1; length <= max; length++) {
    layer = layer.flatMap(prefix => Array.from(alphabet, char => prefix + char));
    all.push(...layer);
  }
  return all;
}

for (const problem of problemList) {
  test(`${problem.title}: both registered traces have valid code lines and indices`, () => {
    assert.ok(problem.steps);
    for (const mode of ["brute", "optimized"] as const) validateSteps(problem.steps[mode], problem.pseudocode[mode].length);
  });
}

test("minimum window: normal, empty, repeated targets, absent target, boundaries, and Unicode", () => {
  for (const [source, target, expected] of [
    ["ADOBECODEBANC", "ABC", "BANC"], ["", "A", ""], ["A", "", ""], ["A", "A", "A"],
    ["A", "AA", ""], ["AAABBC", "AABC", "AABBC"], ["abc", "z", ""], ["ab", "b", "b"], ["😀a😀", "😀😀", "😀a😀"],
  ]) {
    assert.equal(result(minBrute(source, target), 4), expected);
    assert.equal(result(minFast(source, target), 5), expected);
  }
});

test("minimum window: exhaustive short inputs against an independent substring oracle", () => {
  for (const source of words("AB", 5)) for (const target of words("AB", 3)) {
    let expected = "";
    if (target) outer: for (let length = 1; length <= source.length; length++) {
      for (let start = 0; start + length <= source.length; start++) {
        const candidate = source.slice(start, start + length);
        const covers = [...new Set(target)].every(char => candidate.split(char).length >= target.split(char).length);
        if (covers) { expected = candidate; break outer; }
      }
    }
    assert.equal(result(minBrute(source, target), 4), expected, `${source}/${target}`);
    assert.equal(result(minFast(source, target), 5), expected, `${source}/${target}`);
  }
});

test("longest unique substring: exhaustive samples and edge cases", () => {
  for (const source of [...words("abc", 5), "abcabcbb", "bbbbb", "pwwkew", "😀a😀", "abcdef"]) {
    const chars = Array.from(source);
    let expected = 0;
    for (let left = 0; left < chars.length; left++) for (let end = left + 1; end <= chars.length; end++) {
      const candidate = chars.slice(left, end);
      if (new Set(candidate).size === candidate.length) expected = Math.max(expected, candidate.length);
    }
    assert.equal(result(uniqueBrute(source), 4), expected, source);
    assert.equal(result(uniqueFast(source), 5), expected, source);
  }
});

test("replacement: actual sample answer is 4, not 7; exhaustive bounded inputs agree with oracle", () => {
  assert.equal(result(replaceBrute(), 4), 4);
  assert.equal(result(replaceFast(), 5), 4);
  for (const source of words("AB", 5)) for (const k of [0, 1, 2, 5]) {
    let expected = 0;
    for (let left = 0; left < source.length; left++) for (let end = left + 1; end <= source.length; end++) {
      const candidate = source.slice(left, end);
      if (["A", "B"].some(char => [...candidate].filter(value => value !== char).length <= k)) expected = Math.max(expected, candidate.length);
    }
    for (const [generate, lines] of [[replaceBrute, 4], [replaceFast, 5]] as const) {
      const steps = generate(source, k);
      assert.equal(result(steps, lines), expected);
      const final = steps.at(-1)!;
      if (final.windowRange) {
        const candidate = source.slice(final.windowRange[0], final.windowRange[1] + 1);
        assert.ok(["A", "B"].some(char => [...candidate].filter(value => value !== char).length <= k));
      }
    }
  }
  for (const generate of [replaceBrute, replaceFast]) {
    assert.throws(() => generate("ABC", -1));
    assert.throws(() => generate("abc", 1));
    assert.throws(() => generate("ABC", 0.5));
  }
});

test("anagrams: duplicates, unequal lengths, mismatches, Unicode, and empty strings", () => {
  for (const [left, right, expected] of [
    ["anagram", "nagaram", true], ["rat", "car", false], ["", "", true], ["a", "aa", false],
    ["aab", "abb", false], ["aab", "baa", true], ["😀a", "a😀", true],
  ] as const) {
    assert.equal(result(anagramBrute(left, right), 4), expected);
    assert.equal(result(anagramFast(left, right), 4), expected);
  }
});

test("brackets: all short round-bracket strings and mixed nesting", () => {
  for (const source of [...words("()", 7), "({[]})", "([)]", "{", "]", "[]{}()", "{{[()]}}"]) {
    let reduced = source;
    while (/\(\)|\[\]|\{\}/.test(reduced)) reduced = reduced.replace(/\(\)|\[\]|\{\}/g, "");
    assert.equal(result(bracketsBrute(source), 4), reduced.length === 0, source);
    assert.equal(result(bracketsFast(source), 6), reduced.length === 0, source);
  }
  assert.throws(() => bracketsBrute("abc"));
  assert.throws(() => bracketsFast("a()"));
});

test("palindrome: normalization, mismatches, punctuation, and empty input", () => {
  for (const source of ["", "x", "!!!", "A man, a plan, a canal: Panama", "race a car", "0P", "abba", "ab"]) {
    const clean = source.replace(/[^a-z0-9]/gi, "").toLowerCase();
    const expected = clean === [...clean].reverse().join("");
    assert.equal(result(palindromeBrute(source), 4), expected);
    assert.equal(result(palindromeFast(source), 6), expected);
  }
});

test("generators are deterministic and retain independent state snapshots", () => {
  for (const generate of [minBrute, minFast, uniqueBrute, uniqueFast, replaceBrute, replaceFast, anagramBrute, anagramFast, bracketsBrute, bracketsFast, palindromeBrute, palindromeFast]) {
    assert.deepEqual(generate(), generate());
  }
  const steps = anagramFast("aa", "aa");
  assert.equal(steps[1].hashMap![0].value, "1");
  assert.equal(steps.at(-1)!.hashMap![0].value, "0");
  assert.ok(minBrute().length > 3 && uniqueBrute().length > 3 && replaceBrute().length > 3);
});
