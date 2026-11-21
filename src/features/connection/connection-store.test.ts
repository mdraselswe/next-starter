import { afterEach, describe, expect, it, vi } from "vitest";
import { BACK_ONLINE_MS, getStatus, subscribe } from "./connection-store";

describe("connection store", () => {
  afterEach(() => vi.useRealTimers());

  it("goes offline, shows 'back' when the network returns, then hides", () => {
    vi.useFakeTimers();
    const changes: string[] = [];
    const unsubscribe = subscribe(() => changes.push(getStatus()));

    expect(getStatus()).toBe("online");
    window.dispatchEvent(new Event("offline"));
    expect(getStatus()).toBe("offline");
    window.dispatchEvent(new Event("online"));
    expect(getStatus()).toBe("back");
    vi.advanceTimersByTime(BACK_ONLINE_MS);
    expect(getStatus()).toBe("online");
    expect(changes).toEqual(["offline", "back", "online"]);
    unsubscribe();
  });

  it("never says 'back online' without a drop first", () => {
    const unsubscribe = subscribe(() => undefined);
    window.dispatchEvent(new Event("online"));
    expect(getStatus()).toBe("online");
    unsubscribe();
  });

  it("a new drop cancels the pending hide", () => {
    vi.useFakeTimers();
    const unsubscribe = subscribe(() => undefined);
    window.dispatchEvent(new Event("offline"));
    window.dispatchEvent(new Event("online"));
    window.dispatchEvent(new Event("offline"));
    vi.advanceTimersByTime(BACK_ONLINE_MS);
    expect(getStatus()).toBe("offline");
    unsubscribe();
  });
});
