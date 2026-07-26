import type { AlgorithmStep, ProblemDefinition } from "@/libs/types";

const baseArray = [-4, -1, -1, 0, 1, 2];
const sortedArray = [...baseArray].sort((left, right) => left - right);

const brutePseudocode = [
  "for i in range(0, n - 2):",
  "  for j in range(i + 1, n - 1):",
  "    for k in range(j + 1, n):",
  "      sum = nums[i] + nums[j] + nums[k]",
  "      if sum == 0: record triplet",
];

const optimizedPseudocode = [
  "sort(nums)",
  "for i in range(0, n - 2):",
  "  if i > 0 and nums[i] == nums[i - 1]: continue",
  "  left = i + 1, right = n - 1",
  "  while left < right:",
  "    sum = nums[i] + nums[left] + nums[right]",
  "    if sum == 0: record and move both pointers",
  "    elif sum < 0: left += 1",
  "    else: right -= 1",
];

function makeStep(step: Omit<AlgorithmStep, "array">, array: number[]): AlgorithmStep {
  return {
    ...step,
    array,
  };
}

function buildBruteForceSteps(): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [
    makeStep(
      {
        id: "brute-start",
        label: "Initialize brute force",
        message: "Inspect every possible triplet so the full search cost is visible.",
        codeLine: 1,
        activeIndices: [],
        foundIndices: [],
        pointers: {},
      },
      baseArray,
    ),
  ];

  const seen = new Set<string>();

  for (let i = 0; i < baseArray.length - 2; i += 1) {
    steps.push(
      makeStep(
        {
          id: `brute-i-${i}`,
          label: `Fix i at ${i}`,
          message: `Lock ${baseArray[i]} at index ${i} and scan the remaining pairs.`,
          codeLine: 1,
          activeIndices: [i],
          foundIndices: [],
          pointers: { i },
        },
        baseArray,
      ),
    );

    for (let j = i + 1; j < baseArray.length - 1; j += 1) {
      steps.push(
        makeStep(
          {
            id: `brute-j-${i}-${j}`,
            label: `Inspect pair (${i}, ${j})`,
            message: `Pair ${baseArray[i]} and ${baseArray[j]} before checking the third value.`,
            codeLine: 2,
            activeIndices: [i, j],
            foundIndices: [],
            pointers: { i, j },
          },
          baseArray,
        ),
      );

      for (let k = j + 1; k < baseArray.length; k += 1) {
        const sum = baseArray[i] + baseArray[j] + baseArray[k];
        const combo = [baseArray[i], baseArray[j], baseArray[k]].sort((left, right) => left - right).join(",");

        steps.push(
          makeStep(
            {
              id: `brute-k-${i}-${j}-${k}`,
              label: `Check triplet ${i}, ${j}, ${k}`,
              message: `Checking ${baseArray[i]} + ${baseArray[j]} + ${baseArray[k]} = ${sum}.`,
              codeLine: 4,
              activeIndices: [i, j, k],
              foundIndices: sum === 0 ? [i, j, k] : [],
              pointers: { i, j, k },
            },
            baseArray,
          ),
        );

        if (sum === 0 && !seen.has(combo)) {
          seen.add(combo);
          steps.push(
            makeStep(
              {
                id: `brute-found-${i}-${j}-${k}`,
                label: "Triplet found",
                message: `Triplet ${combo.replaceAll(",", ", ")} meets the zero target, but brute force still had to inspect every candidate.`,
                codeLine: 5,
                activeIndices: [i, j, k],
                foundIndices: [i, j, k],
                pointers: { i, j, k },
              },
              baseArray,
            ),
          );
        }
      }
    }
  }

  return steps;
}

function buildOptimizedSteps(): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [
    makeStep(
      {
        id: "optimized-start",
        label: "Sort and anchor",
        message: "Sort the array, then anchor one value and sweep the remaining range with two pointers.",
        codeLine: 1,
        activeIndices: [],
        foundIndices: [],
        pointers: {},
      },
      sortedArray,
    ),
  ];

  const seen = new Set<string>();

  for (let i = 0; i < sortedArray.length - 2; i += 1) {
    if (i > 0 && sortedArray[i] === sortedArray[i - 1]) {
      steps.push(
        makeStep(
          {
            id: `optimized-skip-${i}`,
            label: `Skip duplicate anchor ${i}`,
            message: `Skip ${sortedArray[i]} at index ${i} to avoid duplicate triplets.`,
            codeLine: 3,
            activeIndices: [i],
            foundIndices: [],
            pointers: { i },
          },
          sortedArray,
        ),
      );
      continue;
    }

    let left = i + 1;
    let right = sortedArray.length - 1;

    steps.push(
      makeStep(
        {
          id: `optimized-i-${i}`,
          label: `Anchor i at ${i}`,
          message: `Use ${sortedArray[i]} as the anchor and slide the inner window.`,
          codeLine: 2,
          activeIndices: [i, left, right],
          foundIndices: [],
          pointers: { i, left, right },
        },
        sortedArray,
      ),
    );

    while (left < right) {
      const sum = sortedArray[i] + sortedArray[left] + sortedArray[right];
      const combo = [sortedArray[i], sortedArray[left], sortedArray[right]].join(",");

      steps.push(
        makeStep(
          {
            id: `optimized-check-${i}-${left}-${right}`,
            label: `Window ${left}-${right}`,
            message: `Checking ${sortedArray[i]} + ${sortedArray[left]} + ${sortedArray[right]} = ${sum}.`,
            codeLine: 5,
            activeIndices: [i, left, right],
            foundIndices: [],
            pointers: { i, left, right },
          },
          sortedArray,
        ),
      );

      if (sum === 0) {
        if (!seen.has(combo)) {
          seen.add(combo);
          steps.push(
            makeStep(
              {
                id: `optimized-found-${i}-${left}-${right}`,
                label: "Triplet found",
                message: `Found ${combo.replaceAll(",", ", ")} with the sorted window, then move both pointers to continue.`,
                codeLine: 7,
                activeIndices: [i, left, right],
                foundIndices: [i, left, right],
                pointers: { i, left, right },
              },
              sortedArray,
            ),
          );
        }

        left += 1;
        right -= 1;
        steps.push(
          makeStep(
            {
              id: `optimized-shift-both-${i}-${left}-${right}`,
              label: "Shift both pointers",
              message: "Move both pointers inward after a hit to search for the next unique pair.",
              codeLine: 7,
              activeIndices: [i, Math.max(left - 1, i + 1), Math.min(right + 1, sortedArray.length - 1)],
              foundIndices: [],
              pointers: { i, left, right },
            },
            sortedArray,
          ),
        );

        while (left < right && sortedArray[left] === sortedArray[left - 1]) {
          steps.push(
            makeStep(
              {
                id: `optimized-skip-left-${i}-${left}`,
                label: "Skip duplicate left",
                message: `Skip duplicate value ${sortedArray[left]} on the left side.`,
                codeLine: 7,
                activeIndices: [i, left],
                foundIndices: [],
                pointers: { i, left, right },
              },
              sortedArray,
            ),
          );
          left += 1;
        }

        while (left < right && sortedArray[right] === sortedArray[right + 1]) {
          steps.push(
            makeStep(
              {
                id: `optimized-skip-right-${i}-${right}`,
                label: "Skip duplicate right",
                message: `Skip duplicate value ${sortedArray[right]} on the right side.`,
                codeLine: 7,
                activeIndices: [i, right],
                foundIndices: [],
                pointers: { i, left, right },
              },
              sortedArray,
            ),
          );
          right -= 1;
        }
      } else if (sum < 0) {
        steps.push(
          makeStep(
            {
              id: `optimized-left-${i}-${left}`,
              label: "Sum too small",
              message: "The total is below zero, so move the left pointer to increase the sum.",
              codeLine: 8,
              activeIndices: [i, left, right],
              foundIndices: [],
              pointers: { i, left, right },
            },
            sortedArray,
          ),
        );
        left += 1;
      } else {
        steps.push(
          makeStep(
            {
              id: `optimized-right-${i}-${right}`,
              label: "Sum too large",
              message: "The total is above zero, so move the right pointer to reduce the sum.",
              codeLine: 9,
              activeIndices: [i, left, right],
              foundIndices: [],
              pointers: { i, left, right },
            },
            sortedArray,
          ),
        );
        right -= 1;
      }
    }
  }

  return steps;
}

export const threeSumSteps = {
  brute: buildBruteForceSteps(),
  optimized: buildOptimizedSteps(),
};

export const threeSumProblem: ProblemDefinition = {
  patternSlug: "two-pointers",
  problemSlug: "three-sum",
  title: "3Sum",
  description: "Find all unique triplets that sum to zero.",
  summary: "The brute force version inspects every combination, while the optimized version sorts once and compresses the search with a sliding window.",
  input: baseArray,
  defaultMode: "optimized",
  pseudocode: {
    brute: brutePseudocode,
    optimized: optimizedPseudocode,
  },
  complexity: {
    brute: {
      time: "O(n^3)",
      space: "O(1)",
      detail: "Every triplet is checked directly, which is easy to understand but expensive at scale.",
    },
    optimized: {
      time: "O(n^2)",
      space: "O(1)",
      detail: "Sorting plus two pointers removes one full nested loop and makes the search much cheaper.",
    },
  },
  steps: threeSumSteps,
};