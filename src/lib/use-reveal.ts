import { useEffect, useRef } from "react";

/**
 * 配下の [data-rv] が画面に入ったとき、一度だけ .is-in を付ける。
 * 見た目の変化は CSS 側（`.js .rdx [data-rv]`）が持つ。
 * DOM の動的更新やルート遷移後に追加された要素も監視する。
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (typeof IntersectionObserver === "undefined") {
      root.querySelectorAll<HTMLElement>("[data-rv]").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const observed = new WeakSet<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const scanAndObserve = () => {
      const targets = root.querySelectorAll<HTMLElement>("[data-rv]:not(.is-in)");
      targets.forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      });
    };

    scanAndObserve();

    const mutationObserver = new MutationObserver(() => {
      scanAndObserve();
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return ref;
}
