import type { AlgorithmStep } from "@/libs/types";

const cards = [1, 2, 3, 4, 5, 6, 1];
const k = 3;

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, score: number): AlgorithmStep {
	return { stepNumber, id, label, message, codeLine, action, array: cards, activeIndices: [left, right], foundIndices: action === "found" ? [left, right] : [], pointers: { left, right }, windowRange: [left, right], windowLength: right - left + 1 };
}

export function generateMaximumPointsFromCardsBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "brute-start", label: "Try each split", message: `Choose i cards from the left and ${k} - i from the right for every possible i.`, codeLine: 1, action: "move", array: cards, activeIndices: [], foundIndices: [], pointers: {} }];
	let stepNumber = 2;
	let best = 0;
	for (let leftCount = 0; leftCount <= k; leftCount += 1) {
		let score = 0;
		for (let index = 0; index < leftCount; index += 1) score += cards[index];
		for (let index = 0; index < k - leftCount; index += 1) score += cards[cards.length - 1 - index];
		best = Math.max(best, score);
		steps.push(makeStep(stepNumber++, `split-${leftCount}`, "Evaluate split", `Take ${leftCount} from the left and ${k - leftCount} from the right for ${score} points.`, 2, score === best ? "found" : "compare", Math.max(0, leftCount - 1), cards.length - Math.max(1, k - leftCount), score));
	}
	return steps;
}

export function generateMaximumPointsFromCardsOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "optimized-start", label: "Find the middle block", message: "Taking k cards from the ends leaves a middle block of length n - k; minimize that block.", codeLine: 1, action: "move", array: cards, activeIndices: [0, cards.length - k - 1], foundIndices: [], pointers: { left: 0, right: cards.length - k - 1 }, windowRange: [0, cards.length - k - 1], windowLength: cards.length - k }];
	const middleLength = cards.length - k;
	const total = cards.reduce((sum, value) => sum + value, 0);
	let windowSum = cards.slice(0, middleLength).reduce((sum, value) => sum + value, 0);
	let minimum = windowSum;
	let minimumLeft = 0;
	let stepNumber = 2;
	for (let right = middleLength; right < cards.length; right += 1) {
		const left = right - middleLength + 1;
		windowSum += cards[right] - cards[left - 1];
		if (windowSum < minimum) { minimum = windowSum; minimumLeft = left; }
		steps.push(makeStep(stepNumber++, `middle-${right}`, "Slide middle block", `Middle sum is ${windowSum}; the best end-card score is ${total - minimum}.`, 2, "calculate", left, right, total - windowSum));
	}
	steps.push(makeStep(stepNumber, "optimized-found", "Maximum points", `Keep every card except the minimum middle sum ${minimum}; the answer is ${total - minimum}.`, 3, "found", minimumLeft, minimumLeft + middleLength - 1, total - minimum));
	return steps;
}