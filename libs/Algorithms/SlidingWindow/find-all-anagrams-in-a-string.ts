import type { AlgorithmStep, HashMapEntry } from "@/libs/types";

const text = "cbaebabacd";
const pattern = "abc";
const chars = text.split("");

function mapEntries(counts: Map<string, number>, highlightedKey?: string, matched = false): HashMapEntry[] {
	return [...counts.entries()].map(([key, value]) => ({ key, value: String(value), highlighted: key === highlightedKey, matched }));
}

function countCharacters(value: string): Map<string, number> {
	const counts = new Map<string, number>();
	for (const char of value) counts.set(char, (counts.get(char) ?? 0) + 1);
	return counts;
}

function sameCounts(left: Map<string, number>, right: Map<string, number>): boolean {
	if (left.size !== right.size) return false;
	for (const [key, value] of left) if (right.get(key) !== value) return false;
	return true;
}

function createStep(
	stepNumber: number,
	id: string,
	label: string,
	message: string,
	codeLine: number,
	action: AlgorithmStep["action"],
	left: number,
	right: number,
	hashMap: HashMapEntry[],
	foundIndices: number[] = [],
): AlgorithmStep {
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: chars,
		activeIndices: left <= right ? [left, right] : [],
		foundIndices,
		pointers: left <= right ? { left, right } : {},
		windowRange: left <= right ? [left, right] : undefined,
		windowLength: left <= right ? right - left + 1 : undefined,
		hashMap,
	};
}

export function generateFindAllAnagramsBruteForceSteps(): AlgorithmStep[] {
	const requiredCounts = countCharacters(pattern);
	const steps: AlgorithmStep[] = [
		createStep(1, "brute-start", "Check every window", "Build a frequency map for each substring with the pattern's length.", 1, "move", -1, -1, mapEntries(requiredCounts)),
	];
	const foundStarts: number[] = [];

	for (let left = 0; left <= chars.length - pattern.length; left += 1) {
		const right = left + pattern.length - 1;
		const windowCounts = countCharacters(text.slice(left, right + 1));
		const matches = sameCounts(windowCounts, requiredCounts);
		if (matches) foundStarts.push(left);
		steps.push(createStep(
			steps.length + 1,
			`brute-window-${left}`,
			matches ? "Anagram found" : "Compare window",
			matches ? `The window '${text.slice(left, right + 1)}' is an anagram starting at index ${left}.` : `The window '${text.slice(left, right + 1)}' does not match the pattern counts.`,
			2,
			matches ? "found" : "compare",
			left,
			right,
			mapEntries(windowCounts, text[left], matches),
			matches ? Array.from({ length: pattern.length }, (_, index) => left + index) : [],
		));
	}

	steps.push(createStep(steps.length + 1, "brute-result", "Collect all matches", `Anagrams begin at indices ${foundStarts.join(", ")}.`, 3, "found", foundStarts[0], foundStarts[0] + pattern.length - 1, mapEntries(requiredCounts, undefined, true), foundStarts.flatMap((start) => Array.from({ length: pattern.length }, (_, index) => start + index))));
	return steps;
}

export function generateFindAllAnagramsOptimizedSteps(): AlgorithmStep[] {
	const requiredCounts = countCharacters(pattern);
	const windowCounts = new Map<string, number>();
	const steps: AlgorithmStep[] = [];
	const foundStarts: number[] = [];
	let left = 0;
	let stepNumber = 1;

	steps.push(createStep(stepNumber++, "optimized-start", "Start sliding window", `Slide a window of exactly ${pattern.length} characters while updating counts incrementally.`, 1, "move", -1, -1, mapEntries(requiredCounts)));

	for (let right = 0; right < chars.length; right += 1) {
		const entering = chars[right];
		windowCounts.set(entering, (windowCounts.get(entering) ?? 0) + 1);
		if (right - left + 1 > pattern.length) {
			const leaving = chars[left];
			windowCounts.set(leaving, (windowCounts.get(leaving) ?? 0) - 1);
			if (windowCounts.get(leaving) === 0) windowCounts.delete(leaving);
			left += 1;
		}

		const fullWindow = right - left + 1 === pattern.length;
		const matches = fullWindow && sameCounts(windowCounts, requiredCounts);
		if (matches) foundStarts.push(left);
		steps.push(createStep(
			stepNumber++,
			`optimized-${right}`,
			matches ? "Anagram found" : "Slide window",
			matches ? `The current window is an anagram; record start index ${left}.` : `Update counts for '${entering}' and keep the window at the pattern length.`,
			2,
			matches ? "found" : "move",
			left,
			right,
			mapEntries(windowCounts, entering, matches),
			matches ? Array.from({ length: pattern.length }, (_, index) => left + index) : [],
		));
	}

	steps.push(createStep(stepNumber, "optimized-result", "All anagrams found", `Anagram windows start at indices ${foundStarts.join(", ")}.`, 3, "found", foundStarts[foundStarts.length - 1] ?? 0, (foundStarts[foundStarts.length - 1] ?? 0) + pattern.length - 1, mapEntries(windowCounts, undefined, true), foundStarts.flatMap((start) => Array.from({ length: pattern.length }, (_, index) => start + index))));
	return steps;
}