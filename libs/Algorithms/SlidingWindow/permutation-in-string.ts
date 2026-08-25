import type { AlgorithmStep, HashMapEntry } from "@/libs/types";

const text = "eidbaooo";
const pattern = "ab";
const chars = text.split("");

function mapEntries(counts: Map<string, number>, highlightedKey?: string, matched = false): HashMapEntry[] {
	return [...counts.entries()].map(([key, value]) => ({
		key,
		value: String(value),
		highlighted: key === highlightedKey,
		matched,
	}));
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

function countCharacters(value: string): Map<string, number> {
	const counts = new Map<string, number>();
	for (const char of value) {
		counts.set(char, (counts.get(char) ?? 0) + 1);
	}
	return counts;
}

function sameCounts(left: Map<string, number>, right: Map<string, number>): boolean {
	if (left.size !== right.size) return false;
	for (const [key, value] of left) {
		if (right.get(key) !== value) return false;
	}
	return true;
}

export function generatePermutationInStringBruteForceSteps(): AlgorithmStep[] {
	const patternCounts = countCharacters(pattern);
	const steps: AlgorithmStep[] = [
		createStep(1, "brute-start", "Check fixed windows", "Compare every substring with the pattern's character frequencies.", 1, "move", -1, -1, mapEntries(patternCounts)),
	];

	for (let left = 0; left <= chars.length - pattern.length; left += 1) {
		const right = left + pattern.length - 1;
		const windowCounts = countCharacters(text.slice(left, right + 1));
		const matches = sameCounts(windowCounts, patternCounts);
		steps.push(createStep(
			steps.length + 1,
			`brute-window-${left}`,
			matches ? "Permutation found" : "Compare window",
			matches
				? `The window '${text.slice(left, right + 1)}' contains the same counts as '${pattern}'.`
				: `The window '${text.slice(left, right + 1)}' has different character frequencies.`,
			2,
			matches ? "found" : "compare",
			left,
			right,
			mapEntries(windowCounts, text[left], matches),
			matches ? Array.from({ length: pattern.length }, (_, index) => left + index) : [],
		));
		if (matches) break;
	}

	return steps;
}

export function generatePermutationInStringOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	const requiredCounts = countCharacters(pattern);
	const windowCounts = new Map<string, number>();
	let left = 0;
	let stepNumber = 1;

	steps.push(createStep(stepNumber++, "optimized-start", "Start sliding window", `Maintain a window of exactly ${pattern.length} characters and track its frequencies.`, 1, "move", -1, -1, mapEntries(requiredCounts)));

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
		steps.push(createStep(
			stepNumber++,
			`optimized-${right}`,
			matches ? "Permutation found" : "Slide window",
			matches
				? `The window '${text.slice(left, right + 1)}' is a permutation of '${pattern}'.`
			: `Add '${entering}' and remove the oldest character when the window grows too large.`,
			2,
			matches ? "found" : "move",
			left,
			right,
			mapEntries(windowCounts, entering, matches),
			matches ? Array.from({ length: pattern.length }, (_, index) => left + index) : [],
		));
		if (matches) break;
	}

	if (!steps.some((step) => step.action === "found")) {
		steps.push(createStep(stepNumber, "optimized-not-found", "No permutation found", `No window in '${text}' matches the character frequencies of '${pattern}'.`, 3, "skip", left, chars.length - 1, mapEntries(windowCounts)));
	}

	return steps;
}