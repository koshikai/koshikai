import "@testing-library/jest-dom/vitest";

/**
 * happy-dom は IntersectionObserver を持たない。
 *
 * サイト側はこれを「スクロールで見えたら演出を始める」ために使っているので、
 * テストでは常に進入済みとして即座にコールバックを呼ぶ。これが無いと
 * コンポーネントのマウント時点で ReferenceError になる。
 *
 * 特定のテストで発火タイミングを制御したい場合は、個別に
 * vi.stubGlobal("IntersectionObserver", ...) で上書きする。
 */
class ImmediatelyIntersectingObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: number[] = [];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }

  unobserve() {}

  disconnect() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver ??=
  ImmediatelyIntersectingObserver as unknown as typeof IntersectionObserver;
