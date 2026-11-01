# Codebase fixes and validation

## Resolved findings

1. **Critical production dependency advisories.** Upgraded to Next.js 16.4.3 and React 19.3.1, updated compatible lint tooling, and refreshed patched transitive dependencies. Removed the unused Tailwind 4 PostCSS plugin because the project uses Tailwind 3. `npm audit --omit=dev` now reports zero vulnerabilities. The full audit still reports moderate development-tool advisories through ESLint's minimatch dependencies; no incompatible overrides or forced tool downgrades were applied.
2. **Preset algorithm answers.** Minimum Window Substring, Longest Substring Without Repeating Characters, Longest Repeating Character Replacement, Valid Anagram, Valid Parentheses, and Valid Palindrome now execute actual independent approaches with computed results. Inputs are parameters with defaults for the existing demos. Empty, repeated, missing, and invalid input cases have explicit behavior. The replacement sample now correctly returns 4, rather than 7.
3. **Incorrect shared teaching content.** The shared visualizer uses the current problem's summary and approach complexity explanation. Generic approach headings replace the hardcoded 3Sum headings. Pseudocode lines match actual emitted events; registry-wide tests caught and fixed additional line-count mismatches in five older problems. Bracket reduction renders a changing array, while the optimized approach renders its actual stack.
4. **Stale playback.** Problem routes render a client visualizer keyed by problem identity. The playback hook also resets synchronously when its step-group data changes. Mode changes reset playback, manual stepping pauses it, empty/single-step runs cannot play, and reaching the last step stops the timer. Playing again restarts the run.
5. **Missing regression coverage.** `npm test` covers all 13 registered problems' step indices and pseudocode bounds, six repaired algorithms' results and edge cases, exhaustive small-input reference comparisons, deterministic snapshots, callback validation, and real hook playback under React Strict Mode with controlled timers. `npm run test:auth` checks authentication over HTTP against a production build.
6. **Page protection.** Only `/`, `/signin`, OAuth endpoints, and static assets are public. The Next.js request proxy requires a valid encrypted session for other routes. Problem and account pages independently check the session before rendering. Successful sign-in returns to the requested local lesson.

## Validation

- Algorithm and playback suite: 23 passing tests, including thousands of small-input checks.
- Authentication suite: 17 passing tests, including authenticated rendering, forged/expired cookies, CSRF, sign-out, and return URL checks.
- TypeScript, ESLint, and production build pass.
- Production dependency audit: zero vulnerabilities.
- Real GitHub consent and callback exchange require user-owned provider credentials; tests use isolated local fixtures.

## Remaining limits outside these fixes

Some older algorithms still expose only their built-in sample inputs; the six repaired implementations accept explicit inputs. The suite validates every registered trace's structural invariants but is not a complete correctness proof of every algorithm in the repository.

Array-backed deque examples still use `shift()`, whose worst-case cost differs from a constant-time deque operation. These examples are not in the active problem registry. Complexity cards describe core algorithm work, excluding retained visualization snapshots; the UI now states this distinction.
