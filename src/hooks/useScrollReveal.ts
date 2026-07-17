'use client';
import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.transitionDelay = `${(i % 6) * 60}ms`;
      io.observe(htmlEl);
    });

    return () => {
      io.disconnect();
    };
  }, []);
}
