import type { AlgorithmStep } from "@/libs/types";

const phrase = "A man, a plan, a canal: Panama";
const chars = phrase.split("");

function isAlphaNumeric(value: string) {
	return /[a-z0-9]/i.test(value);
}

function buildStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, found = false): AlgorithmStep {
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: chars,
		activeIndices: left === right ? [left] : [left, right],
		foundIndices: found ? [left, right] : [],
		pointers: { left, right },
	};
}

export function generateValidPalindromeBruteForceSteps(): AlgorithmStep[] {
	const cleaned = chars.filter(isAlphaNumeric).map((char) => char.toLowerCase());
	const reversed = [...cleaned].reverse();
	const steps: AlgorithmStep[] = [
		{
			stepNumber: 1,
			id: "brute-start",
			label: "Normalize string",
			message: "Clean the string by removing punctuation and lowercasing characters.",
			codeLine: 1,
			action: "move",
			array: chars,
			activeIndices: [],
			foundIndices: [],
			pointers: {},
		},
	];

	steps.push({
		stepNumber: 2,
		id: "brute-compare",
		label: "Compare reversed copy",
		message: `Compare the normalized string against its reversed copy: ${cleaned.join("")}.`,
		codeLine: 2,
		action: "compare",
		array: chars,
		activeIndices: [],
		foundIndices: [],
		pointers: {},
	});

	steps.push({
		stepNumber: 3,
		id: "brute-found",
		label: "Palindrome confirmed",
		message: `The reversed copy matches: ${reversed.join("")}.`,
		codeLine: 3,
		action: "found",
		array: chars,
		activeIndices: [],
		foundIndices: [],
		pointers: {},
	});

	return steps;
}

export function generateValidPalindromeOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	let left = 0;
	let right = chars.length - 1;

	steps.push(buildStep(stepNumber++, "optimized-start", "Start two pointers", "Walk inward from both ends and skip non-alphanumeric characters.", 1, "move", left, right));

	while (left < right) {
		if (!isAlphaNumeric(chars[left])) {
			steps.push({
				...buildStep(stepNumber++, `skip-left-${left}`, "Skip left character", `Ignore '${chars[left]}' because it is not alphanumeric.`, 2, "skip", left, right),
				activeIndices: [left],
			});
			left += 1;
			continue;
		}

		if (!isAlphaNumeric(chars[right])) {
			steps.push({
				...buildStep(stepNumber++, `skip-right-${right}`, "Skip right character", `Ignore '${chars[right]}' because it is not alphanumeric.`, 2, "skip", left, right),
				activeIndices: [right],
			});
			right -= 1;
			continue;
		}

		const leftChar = chars[left].toLowerCase();
		const rightChar = chars[right].toLowerCase();

		steps.push(buildStep(stepNumber++, `compare-${left}-${right}`, "Compare characters", `Compare '${chars[left]}' with '${chars[right]}'.`, 3, "compare", left, right));

		if (leftChar !== rightChar) {
			steps.push(buildStep(stepNumber++, `mismatch-${left}-${right}`, "Not a palindrome", `Mismatch at '${chars[left]}' and '${chars[right]}'.`, 4, "found", left, right));
			return steps;
		}

		steps.push(buildStep(stepNumber++, `advance-${left}-${right}`, "Characters match", `Move inward after matching '${chars[left]}' and '${chars[right]}'.`, 5, "move", left, right));
		left += 1;
		right -= 1;
	}

	steps.push(buildStep(stepNumber, "optimized-found", "Palindrome confirmed", "All mirrored characters match.", 6, "found", 0, chars.length - 1, true));

	return steps;
}
