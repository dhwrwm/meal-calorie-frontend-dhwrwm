import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRetryCountdown } from "../use-retry-countdown";

describe("useRetryCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with the given seconds", () => {
    const { result } = renderHook(() => useRetryCountdown(10));

    expect(result.current.secondsLeft).toBe(10);
    expect(result.current.isActive).toBe(true);
  });

  it("counts down by 1 every second", () => {
    const { result } = renderHook(() => useRetryCountdown(5));

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.secondsLeft).toBe(4);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.secondsLeft).toBe(3);
  });

  it("reaches 0 after the full duration", () => {
    const { result } = renderHook(() => useRetryCountdown(3));

    act(() => vi.advanceTimersByTime(3000));

    expect(result.current.secondsLeft).toBe(0);
    expect(result.current.isActive).toBe(false);
  });

  it("does not go below 0", () => {
    const { result } = renderHook(() => useRetryCountdown(2));

    act(() => vi.advanceTimersByTime(5000));

    expect(result.current.secondsLeft).toBe(0);
  });

  it("isActive is true while counting down", () => {
    const { result } = renderHook(() => useRetryCountdown(3));

    act(() => vi.advanceTimersByTime(2000));

    expect(result.current.isActive).toBe(true);
  });

  it("isActive becomes false when countdown ends", () => {
    const { result } = renderHook(() => useRetryCountdown(2));

    act(() => vi.advanceTimersByTime(2000));

    expect(result.current.isActive).toBe(false);
  });

  it("initializes as inactive when seconds is 0", () => {
    const { result } = renderHook(() => useRetryCountdown(0));

    expect(result.current.secondsLeft).toBe(0);
    expect(result.current.isActive).toBe(false);
  });
});
