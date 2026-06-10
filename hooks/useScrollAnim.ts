"use client";

import { useEffect, useRef, useCallback } from "react";

export function useScrollAnim(threshold = 0.15) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Array<HTMLElement | null>>([]);

  const addToRefs = useCallback((el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
      // Eğer observer zaten başlatılmışsa, sonradan eklenen elementi de izlemeye başla
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold }
    );

    elementsRef.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold]);

  return { addToRefs };
}