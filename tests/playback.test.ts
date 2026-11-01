import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement, StrictMode } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { useAlgo } from "../hooks/useAlgo";
import type { AlgorithmStep } from "../libs/types";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const step = (id: string): AlgorithmStep => ({ id, label: id, message: id, codeLine: 1, array: [1], activeIndices: [], foundIndices: [], pointers: {} });
const first = { brute: [step("b1"), step("b2")], optimized: [step("a1"), step("a2"), step("a3")] };

test("playback resets on replacement data, mode changes, and empty input; timers stop correctly", async context => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  let playback!: ReturnType<typeof useAlgo>;
  function Harness({ groups }: { groups: typeof first }) { playback = useAlgo(groups); return null; }
  let renderer!: ReactTestRenderer;
  const render = (groups: typeof first) => createElement(StrictMode, null, createElement(Harness, { groups }));
  await act(() => { renderer = create(render(first)); });
  try {
    await act(() => playback.next());
    assert.equal(playback.stepIndex, 1);
    await act(() => playback.playPause());
    assert.equal(playback.isPlaying, true);
    const replacement = { brute: [step("new-b")], optimized: [step("new-1"), step("new-2"), step("new-3")] };
    await act(() => renderer.update(render(replacement)));
    assert.equal(playback.currentStep.id, "new-1");
    assert.equal(playback.stepIndex, 0);
    assert.equal(playback.progress, 0);
    assert.equal(playback.isPlaying, false);
    await act(() => context.mock.timers.tick(5000));
    assert.equal(playback.stepIndex, 0, "old problem timer must be canceled");
    await act(() => playback.setSpeed(2));
    await act(() => playback.playPause());
    await act(() => context.mock.timers.tick(599));
    assert.equal(playback.stepIndex, 0);
    await act(() => context.mock.timers.tick(1));
    assert.equal(playback.stepIndex, 1);
    await act(() => context.mock.timers.tick(600));
    assert.equal(playback.stepIndex, 2);
    assert.equal(playback.isPlaying, false);
    assert.equal(playback.progress, 100);
    await act(() => playback.playPause());
    assert.equal(playback.stepIndex, 0, "play at the end starts a fresh run");
    await act(() => playback.next());
    assert.equal(playback.isPlaying, false, "manual stepping pauses playback");
    await act(() => playback.setMode("brute"));
    assert.equal(playback.stepIndex, 0);
    assert.equal(playback.currentStep.id, "new-b");
    await act(() => playback.playPause());
    assert.equal(playback.isPlaying, false, "single-step runs cannot play");
    await act(() => renderer.update(render({ brute: [], optimized: [] })));
    await act(() => { playback.next(); playback.prev(); playback.playPause(); });
    assert.equal(playback.currentStep, undefined);
    assert.equal(playback.progress, 0);
    assert.equal(playback.stepIndex, 0);
    assert.equal(playback.isPlaying, false);
  } finally { await act(() => renderer.unmount()); }
});
