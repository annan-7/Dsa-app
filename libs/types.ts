export type AlgorithmMode = "brute" | "optimized";

export type PointerKey = "i" | "j" | "k" | "left" | "right";

export type AlgorithmAction = "move" | "compare" | "calculate" | "found" | "skip";

export type VisualizationKind = "array" | "array-hashmap" | "array-deque" | "stack";

export interface HashMapEntry {
	key: string;
	value: string;
	highlighted?: boolean;
	inserted?: boolean;
	matched?: boolean;
}

export interface DequeEntry {
	index: number;
	value: number;
	role?: "min" | "max";
}

export interface AlgorithmStep {
	variables?: Record<string, string | number | boolean>;
	result?: string | number | boolean;
	deque?: DequeEntry[];
	maxDeque?: DequeEntry[];
	minDeque?: DequeEntry[];
	stepNumber?: number;
	id: string;
	label: string;
	message: string;
	codeLine: number;
	action?: AlgorithmAction;
	array: Array<number | string>;
	activeIndices: number[];
	foundIndices: number[];
	pointers: Partial<Record<PointerKey, number>>;
	windowRange?: [number, number];
	windowLength?: number;
	hashMap?: HashMapEntry[];
	stack?: string[];
	currentIndex?: number;
	currentChar?: string;
	waterFill?: {
		startIndex: number;
		endIndex: number;
		height: number;
		area: number;
	};
}

export interface ProblemDefinition {
	patternSlug: string;
	problemSlug: string;
	title: string;
	description: string;
	summary: string;
	input: Array<number | string>;
	target?: number | string;
	defaultMode?: AlgorithmMode;
	visualization?: VisualizationKind;
	pseudocode: Record<AlgorithmMode, string[]>;
	complexity: Record<AlgorithmMode, { time: string; space: string; detail: string }>;
	steps?: Record<AlgorithmMode, AlgorithmStep[]>;
}

export interface PatternDefinition {
	slug: string;
	name: string;
	description: string;
	problems: Array<{
		slug: string;
		title: string;
		description: string;
		available?: boolean;
	}>;
}
