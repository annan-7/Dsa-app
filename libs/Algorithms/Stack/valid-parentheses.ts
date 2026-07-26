import type { AlgorithmStep } from "@/libs/types";

const expression = "({[]})";
const tokens = expression.split("");

const openers = new Set(["(", "[", "{"]);
const closers = new Map([
	[")", "("],
	["]", "["],
	["}", "{"],
]);

function step(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], index: number, stack: string[], currentChar: string): AlgorithmStep {
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: tokens,
		activeIndices: [index],
		foundIndices: [],
		pointers: {},
		stack: [...stack],
		currentIndex: index,
		currentChar,
	};
}

export function generateValidParenthesesBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [
		{
			stepNumber: 1,
			id: "brute-start",
			label: "Scan for removable pairs",
			message: "Repeatedly remove matching pairs until nothing changes.",
			codeLine: 1,
			action: "move",
			array: tokens,
			activeIndices: [],
			foundIndices: [],
			pointers: {},
			stack: [],
		},
	];

	steps.push(step(2, "brute-push", "Collect openers", "Push opening brackets into the working stack.", 2, "move", 0, ["("], "("));
	steps.push(step(3, "brute-match", "Remove matching pair", "A closing bracket removes the matching opener.", 3, "compare", 1, ["(", "{"], ")"));
	steps.push(step(4, "brute-found", "Valid string", "After repeated reductions the expression is balanced.", 4, "found", 5, ["(", "{"], ")"));

	return steps;
}

export function generateValidParenthesesOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	const stack: string[] = [];

	steps.push(step(stepNumber++, "optimized-start", "Initialize stack", "Push opening brackets and validate each closing bracket against the top.", 1, "move", 0, stack, tokens[0]));

	for (let index = 0; index < tokens.length; index += 1) {
		const current = tokens[index];

		if (openers.has(current)) {
			stack.push(current);
			steps.push(step(stepNumber++, `push-${index}`, "Push opener", `Push '${current}' onto the stack.`, 2, "move", index, stack, current));
			continue;
		}

		const expected = closers.get(current);
		const top = stack[stack.length - 1];
		steps.push(step(stepNumber++, `compare-${index}`, "Compare with top", `Compare '${current}' against '${top ?? "empty"}'.`, 3, "compare", index, stack, current));

		if (!top || top !== expected) {
			steps.push(step(stepNumber++, `mismatch-${index}`, "Invalid bracket", `Expected '${expected ?? "none"}' but found '${top ?? "empty"}'.`, 4, "found", index, stack, current));
			return steps;
		}

		stack.pop();
		steps.push(step(stepNumber++, `pop-${index}`, "Pop opener", `Match '${current}' and pop '${expected}'.`, 5, "move", index, stack, current));
	}

	steps.push(step(stepNumber, "optimized-found", "String is valid", "The stack is empty after processing every token.", 6, "found", tokens.length - 1, stack, tokens[tokens.length - 1]));

	return steps;
}
