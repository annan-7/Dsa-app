# AGENTS.md

## Project Overview

This repository contains an interactive **DSA / LeetCode Algorithm Visualizer** built for learning and understanding algorithms through visual execution.

The application allows users to:

* Visualize algorithms step by step.
* Compare brute-force and optimized approaches.
* Play, pause, and manually step through executions.
* Adjust visualization speed.
* Observe pointers, indexes, variables, and data-structure state.
* See the corresponding source-code line highlighted.
* Understand time and space complexity.
* Explore common DSA patterns such as Two Pointers, Sliding Window, Hash Maps, and others.

The primary goal is **algorithmic understanding**, not simply obtaining the correct answer.

---

# Technology Stack

The project currently uses:

* **Framework:** Next.js 14
* **Architecture:** App Router
* **Language:** TypeScript
* **TypeScript configuration:** Strict
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **Package manager:** npm

## Technology Rules

* Use TypeScript for application code.
* Follow strict TypeScript rules.
* Use existing project dependencies whenever possible.
* Do not introduce a new dependency when the existing stack can solve the problem.
* Do not introduce another animation library when Framer Motion is sufficient.
* Do not introduce another styling framework when Tailwind CSS is sufficient.
* Do not introduce a state-management library unless explicitly requested.
* Follow the existing project's conventions before introducing new patterns.

---

# Core Philosophy

The most important rule of this project is:

> **Every important algorithmic operation should be understandable through the visualization.**

The visualizer should answer:

1. What is happening?
2. Why is it happening?
3. What changed?
4. What does the algorithm do next?

Do not build animations that merely look impressive.

Animations must communicate algorithmic state.

---

# Core Architecture

The project should conceptually follow this pipeline:

```text
LeetCode Problem
       ↓
Problem Definition
       ↓
Algorithm / Approach
       ↓
Execution Steps
       ↓
Visualization State
       ↓
Visualizer Components
       ↓
User Controls
```

Algorithms should be separated from visualization.

The preferred architecture is:

```text
Algorithm
    ↓
Step Generator
    ↓
VisualizationStep[]
    ↓
Visualization Engine
    ↓
UI
```

The algorithm should describe **what happens**.

The visualization layer should determine **how it is displayed**.

---

# Separation of Concerns

## Algorithm Layer

Responsible for:

* Algorithm correctness.
* Data manipulation.
* Variables.
* Control flow.
* Generating execution states.
* Returning the final result.

It should not depend on:

* React components.
* DOM APIs.
* Framer Motion.
* Tailwind CSS.
* Browser-specific APIs.

---

## Visualization Layer

Responsible for:

* Rendering data structures.
* Rendering pointers.
* Rendering variables.
* Highlighting changes.
* Animations.
* Code highlighting.
* Step navigation.
* Playback controls.

The visualization layer should consume algorithm state instead of implementing the algorithm itself.

---

## UI Layer

Responsible for:

* Layout.
* User interaction.
* Navigation.
* Controls.
* Problem selection.
* Approach selection.
* Responsive behavior.

UI components should not contain large algorithm implementations.

---

# Problem Architecture

Every LeetCode problem should follow a consistent structure.

A problem should conceptually contain:

```text
Problem
├── Metadata
├── Description
├── Input
├── Output
├── Examples
├── Constraints
├── Brute Force Approach
│   ├── Algorithm
│   ├── Steps
│   ├── Code
│   └── Complexity
└── Optimized Approach
    ├── Algorithm
    ├── Steps
    ├── Code
    └── Complexity
```

When the existing project provides a problem structure, reuse it instead of creating a new structure.

---

# DSA Patterns

Problems should be organized around recognizable algorithmic patterns.

Examples include:

* Two Pointers
* Sliding Window
* Hash Map
* Binary Search
* Stack
* Queue
* Linked List
* Tree
* Graph
* Heap
* Backtracking
* Dynamic Programming
* Sorting
* Prefix Sum
* Greedy

When adding a problem, identify the primary DSA pattern before implementing it.

---

# Brute Force vs Optimized

The application supports comparing different approaches.

When a problem has both brute-force and optimized solutions, treat them as **independent algorithm implementations**.

For example:

```text
Two Sum

Brute Force
O(n²)
    ↓
Steps

Optimized
O(n)
    ↓
Steps
```

Both approaches should produce compatible visualization states.

The UI should not need to know how the underlying algorithm works.

Do not artificially modify an algorithm just to make it easier to visualize.

The visualization must accurately represent the actual algorithm.

---

# Visualization Steps

Algorithms should expose meaningful execution steps.

Conceptually:

```ts
type VisualizationStep = {
    type: string;
    message: string;
    variables?: Record<string, unknown>;
    codeLine?: number;
    state?: unknown;
};
```

The exact implementation should follow the project's existing types.

Do not create duplicate step systems.

---

# Step Design

Steps should represent meaningful algorithmic events.

Common step types include:

```text
compare
swap
visit
insert
delete
push
pop
enqueue
dequeue
move-pointer
update-variable
split
merge
partition
found
not-found
return
```

Reuse existing step types whenever possible.

Do not create a new step type for an operation that an existing type can represent.

---

# Educational Step Messages

Every important step should provide an explanation.

Bad:

```text
Step 7
```

Better:

```text
Comparing nums[left] with nums[right].
```

Best:

```text
nums[left] + nums[right] is smaller than the target,
so the left pointer moves forward.
```

The explanation should focus on the reasoning behind the algorithm.

Prefer:

```text
What?
Why?
What changed?
```

---

# State Representation

Visualization state should contain the information required to render the current algorithm state.

For an array problem, this might include:

```text
array
left
right
current index
target
comparison
variables
```

For a linked list:

```text
nodes
current
previous
next
connections
```

For a tree:

```text
current node
visited nodes
queue / stack
parent relationships
```

For a graph:

```text
current node
visited nodes
edges
queue / stack
distances
```

Only include state that is useful for visualization or explanation.

Avoid unnecessarily copying large structures.

---

# Code Highlighting

The visualization should connect algorithm execution with source code.

Each meaningful step should be able to identify the relevant code line when applicable.

Conceptually:

```text
Algorithm Step
      ↓
codeLine
      ↓
Code Viewer
      ↓
Highlighted Line
```

Do not hardcode unrelated UI behavior into algorithm implementations.

---

# Variables

Important algorithm variables should be visible to the user.

Examples:

```text
left: 2
right: 7
mid: 4
target: 13
```

When variables change, the visualization should clearly communicate the change.

Do not expose unnecessary implementation details.

Prioritize variables that help explain the algorithm.

---

# Data Structure Visualization

Use representations appropriate to the data structure.

## Arrays

Show:

* Indexes.
* Values.
* Pointers.
* Current elements.
* Comparisons.
* Swaps.

## Linked Lists

Show:

* Nodes.
* Connections.
* Current node.
* Previous node.
* Next node.

## Trees

Show:

* Parent/child relationships.
* Current node.
* Visited nodes.
* Traversal order.

## Graphs

Show:

* Nodes.
* Edges.
* Visited nodes.
* Current node.
* Queue/stack where relevant.

## Stacks

Show:

* Push operations.
* Pop operations.
* Top element.

## Queues

Show:

* Enqueue.
* Dequeue.
* Front.
* Back.

The visualization should prioritize clarity over decorative complexity.

---

# Animation Rules

Animations exist to communicate state changes.

Use Framer Motion for animations when appropriate.

Animations should:

* Clearly indicate what changed.
* Preserve the logical order of operations.
* Respect the selected playback speed.
* Work with manual step navigation.
* Not change algorithm behavior.

Do not:

* Put algorithm logic inside animation callbacks.
* Use arbitrary `setTimeout()` calls as algorithm logic.
* Create animations that hide important state transitions.
* Make animations so elaborate that they obscure the algorithm.

---

# Playback

The visualization should support, where applicable:

```text
Play
Pause
Next Step
Previous Step
Speed
```

Playback should operate on generated states.

Prefer:

```text
steps[currentStep]
```

over continuously mutating the algorithm during animation.

The algorithm should not depend on the animation timer.

---

# Responsive Design

The application is intended to be mobile responsive.

When modifying UI:

* Preserve desktop functionality.
* Check smaller screen sizes.
* Avoid fixed widths when unnecessary.
* Avoid horizontal overflow.
* Keep controls usable on mobile.
* Do not sacrifice algorithm readability.

Use Tailwind CSS and the existing responsive conventions.

---

# Performance

Visualization can become expensive because it may render many states.

Prefer:

* Deterministic step generation.
* Minimal state.
* Reusable components.
* Efficient rendering.
* Avoiding unnecessary deep copies.
* Avoiding unnecessary React re-renders.

For very large inputs, do not generate excessive visualization states without a reason.

Correctness and educational value come before micro-optimizations.

---

# Testing

Every algorithm should be tested independently from the UI whenever possible.

Test:

## Normal Cases

Typical valid inputs.

## Empty Input

When supported:

```text
[]
```

## Single Element

```text
[5]
```

## Duplicates

```text
[2, 2, 2, 3]
```

## Boundary Cases

Test:

* First element.
* Last element.
* Minimum value.
* Maximum value.
* Missing target.

## Algorithm-Specific Cases

Examples:

* Already sorted arrays.
* Reverse-sorted arrays.
* Cyclic linked lists.
* Empty trees.
* Single-node trees.
* Disconnected graphs.

---

# Complexity

Every algorithm should specify:

```text
Time Complexity: O(...)
Space Complexity: O(...)
```

The complexity must correspond to the actual implementation.

When comparing approaches, clearly show the difference.

Example:

```text
Brute Force
Time: O(n²)
Space: O(1)

Optimized
Time: O(n)
Space: O(n)
```

Do not claim complexity without verifying the implementation.

---

# Adding a New LeetCode Problem

When asked to implement a new problem, follow this process:

```text
1. Understand the problem
        ↓
2. Identify the DSA pattern
        ↓
3. Identify possible approaches
        ↓
4. Implement the brute-force solution
        ↓
5. Implement the optimized solution
        ↓
6. Verify correctness
        ↓
7. Generate visualization steps
        ↓
8. Connect code highlighting
        ↓
9. Add variable/state visualization
        ↓
10. Add explanations
        ↓
11. Add complexity
        ↓
12. Add tests
        ↓
13. Run validation
```

Before writing a new implementation, inspect existing problems that use a similar pattern.

Reuse their architecture and components when appropriate.

---

# Before Modifying the Project

The agent should first:

1. Inspect the relevant files.
2. Understand the current architecture.
3. Search for similar existing implementations.
4. Identify reusable components.
5. Identify existing types and utilities.
6. Check whether the requested functionality already exists.
7. Make the smallest appropriate change.

Do not immediately rewrite existing architecture.

---

# Existing Code First

Before creating:

```text
new component
new utility
new type
new abstraction
new dependency
```

search the repository to determine whether an equivalent already exists.

Prefer:

```text
reuse existing code
```

over:

```text
create duplicate implementation
```

---

# Refactoring Rules

Do not perform unrelated refactors while implementing a feature.

Avoid:

* Renaming unrelated files.
* Reformatting unrelated code.
* Rewriting working components.
* Changing the architecture without a clear reason.
* Upgrading dependencies unnecessarily.

If a refactor is genuinely required, explain why before making a large change.

---

# Dependency Rules

Do not install new packages unless necessary.

Before adding a dependency:

1. Check whether the functionality already exists.
2. Check whether the existing stack can solve the problem.
3. Consider whether the dependency adds long-term maintenance cost.
4. Prefer native TypeScript/JavaScript or existing project dependencies when reasonable.

---

# TypeScript Rules

Use strict TypeScript.

Avoid:

```ts
any
```

unless there is a genuine reason.

Prefer:

```ts
unknown
```

with proper type narrowing when the type is not known.

Create reusable types for shared algorithm and visualization concepts.

Do not duplicate type definitions across components.

---

# React / Next.js Rules

Follow the Next.js App Router architecture already established in the project.

Keep components focused.

Prefer:

```text
UI Component
    ↓
State
    ↓
Visualization Data
```

rather than embedding complex algorithm implementations inside components.

Use Client Components only when client-side behavior is required.

Do not unnecessarily convert Server Components into Client Components.

---

# Tailwind Rules

Use the existing Tailwind conventions.

Prefer existing utility patterns and components.

Do not introduce inline styles unless necessary.

Do not create custom CSS for something Tailwind already handles cleanly.

When a repeated visual pattern exists, consider creating a reusable component rather than duplicating large class strings.

---

# Framer Motion Rules

Use Framer Motion for meaningful visual transitions.

Animations should not control algorithm execution.

The algorithm should finish generating its states independently.

Then the visualization system should animate transitions between states.

---

# Accessibility

Interactive controls should remain accessible.

Buttons should:

* Have meaningful labels.
* Be keyboard accessible.
* Communicate disabled states.
* Have appropriate focus states.

Do not rely solely on color to communicate algorithm state.

For example, if a pointer is highlighted, provide another visual indicator when practical.

---

# Error Handling

Invalid input should not silently produce incorrect visualizations.

Handle:

* Missing input.
* Invalid input.
* Unsupported operations.
* Empty data structures.
* Algorithm failures.

Do not hide errors simply to keep the animation running.

---

# Git / Changes

Keep changes focused.

Prefer small, logically grouped changes.

A change should ideally correspond to one purpose:

```text
Add Binary Search visualization
```

rather than:

```text
Add Binary Search
Rewrite visualization engine
Rename components
Upgrade dependencies
Change unrelated styling
```

---

# Definition of Done

A new visualization is considered complete when:

* [ ] The algorithm is correct.
* [ ] Brute-force approach is implemented when applicable.
* [ ] Optimized approach is implemented when applicable.
* [ ] Execution steps are generated.
* [ ] Visualization correctly represents those steps.
* [ ] Important variables are visible.
* [ ] Pointers/indexes are visible when relevant.
* [ ] Data-structure changes are visible.
* [ ] Code highlighting works.
* [ ] Step explanations are meaningful.
* [ ] Play/Pause works.
* [ ] Previous/Next works.
* [ ] Speed controls work.
* [ ] Complexity is documented.
* [ ] Edge cases are handled.
* [ ] Tests pass.
* [ ] TypeScript checks pass.
* [ ] The application builds successfully.
* [ ] Existing visualizations still work.
* [ ] Responsive behavior has not been broken.

---

# Agent Workflow

For every development task:

```text
Understand
    ↓
Inspect
    ↓
Plan
    ↓
Implement
    ↓
Test
    ↓
Review
    ↓
Build
```

## Understand

Determine exactly what the user is asking for.

## Inspect

Inspect the existing implementation and find similar code.

## Plan

Identify:

* Files that need modification.
* Existing components to reuse.
* New code required.
* Potential edge cases.

For large changes, explain the plan before implementation.

## Implement

Make the smallest clean change that satisfies the requirement.

## Test

Run the appropriate:

```text
tests
typecheck
lint
build
```

commands available in the project.

Fix errors rather than ignoring them.

## Review

Check:

* Algorithm correctness.
* Visualization correctness.
* State synchronization.
* UI behavior.
* Type safety.
* Unrelated regressions.

## Build

Ensure the project can successfully build before considering a significant feature complete.

---

# Important Principle

The visualizer is an **educational DSA tool**.

When choosing between two implementations, prefer the one that makes the algorithm:

* Easier to understand.
* Easier to visualize.
* Easier to debug.
* Easier to extend.
* Easier to test.

However:

> **Educational clarity must never come at the cost of algorithmic correctness.**

The visualization must always represent what the algorithm actually does.
