import type { AlgorithmStep } from "@/libs/types";

const fruits = [1, 2, 1, 2, 3, 2, 2];

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, windowLength: number): AlgorithmStep {
	return { stepNumber, id, label, message, codeLine, action, array: fruits, activeIndices: left <= right ? [left, right] : [], foundIndices: [], pointers: { left, right }, windowRange: [left, right], windowLength };
}

export function generateFruitIntoBasketsBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "brute-start", label: "Try every start", message: "Start at each tree and collect fruit until a third type appears.", codeLine: 1, action: "move", array: fruits, activeIndices: [], foundIndices: [], pointers: {} }];
	let best = 0;
	for (let left = 0; left < fruits.length; left += 1) {
		const types = new Set<number>();
		for (let right = left; right < fruits.length; right += 1) {
			types.add(fruits[right]);
			if (types.size > 2) break;
			best = Math.max(best, right - left + 1);
			steps.push(makeStep(steps.length + 1, `brute-${left}-${right}`, "Valid basket window", `The window uses ${types.size} fruit types and holds ${right - left + 1} trees.`, 2, "compare", left, right, right - left + 1));
		}
	}
	steps.push(makeStep(steps.length + 1, "brute-result", `Maximum fruit ${best}`, `The largest valid window contains ${best} trees.`, 3, "found", 0, fruits.length - 1, best));
	return steps;
}

export function generateFruitIntoBasketsOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [makeStep(1, "optimized-start", "Start sliding window", "Keep a window containing fruit from at most two types.", 1, "move", 0, 0, 1)];
	const counts = new Map<number, number>();
	let left = 0;
	let best = 0;
	for (let right = 0; right < fruits.length; right += 1) {
		counts.set(fruits[right], (counts.get(fruits[right]) ?? 0) + 1);
		steps.push(makeStep(steps.length + 1, `expand-${right}`, "Expand window", `Add fruit type ${fruits[right]}; the basket now tracks ${counts.size} types.`, 2, "move", left, right, right - left + 1));
		while (counts.size > 2) {
			const leaving = fruits[left];
			counts.set(leaving, (counts.get(leaving) ?? 0) - 1);
			if (counts.get(leaving) === 0) counts.delete(leaving);
			left += 1;
			steps.push(makeStep(steps.length + 1, `shrink-${left}`, "Third type found", `Discard fruit type ${leaving} from the left until only two types remain.`, 3, "move", left, right, right - left + 1));
		}
		best = Math.max(best, right - left + 1);
		steps.push(makeStep(steps.length + 1, `best-${right}`, "Update best", `The valid basket window holds ${right - left + 1}; best is ${best}.`, 4, "found", left, right, right - left + 1));
	}
	steps.push(makeStep(steps.length + 1, "optimized-result", `Maximum fruit ${best}`, `Two baskets can collect fruit from a longest window of ${best} trees.`, 5, "found", 0, fruits.length - 1, best));
	return steps;
}
