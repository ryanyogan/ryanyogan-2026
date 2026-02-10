import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Custom hook for GSAP animations with automatic cleanup
 */
export function useGSAP<T extends Element = HTMLDivElement>(
  callback: (context: gsap.Context, element: T) => void,
  deps: React.DependencyList = []
) {
  const elementRef = useRef<T>(null);
  const contextRef = useRef<gsap.Context | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current) return;

    // Create GSAP context for automatic cleanup
    contextRef.current = gsap.context(() => {
      callback(contextRef.current!, elementRef.current as T);
    }, elementRef);

    return () => {
      contextRef.current?.revert();
    };
  }, deps);

  return elementRef;
}

/**
 * Hook for scroll-triggered fade-up animations
 */
export function useFadeUp<T extends Element = HTMLDivElement>(
  options: {
    delay?: number;
    duration?: number;
    y?: number;
    stagger?: number;
    trigger?: string;
  } = {}
) {
  const {
    delay = 0,
    duration = 0.8,
    y = 40,
    stagger = 0.1,
    trigger,
  } = options;

  return useGSAP<T>((ctx, element) => {
    const targets = element.querySelectorAll("[data-animate]");
    
    if (targets.length === 0) {
      // Animate the element itself
      gsap.from(element, {
        y,
        opacity: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: trigger ? {
          trigger: trigger,
          start: "top 85%",
          toggleActions: "play none none reverse",
        } : undefined,
      });
    } else {
      // Animate children with data-animate
      gsap.from(targets, {
        y,
        opacity: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: trigger ? {
          trigger: trigger,
          start: "top 85%",
          toggleActions: "play none none reverse",
        } : undefined,
      });
    }
  });
}

/**
 * Hook for text reveal animations (split text effect)
 */
export function useTextReveal<T extends Element = HTMLDivElement>(
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
  } = {}
) {
  const { delay = 0, duration = 0.6, stagger = 0.02 } = options;

  return useGSAP<T>((ctx, element) => {
    // Split text into spans for each character
    const text = element.textContent || "";
    const words = text.split(" ");
    
    element.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block overflow-hidden"><span class="inline-block" data-char>${word}</span></span>`
      )
      .join('<span class="inline-block">&nbsp;</span>');

    const chars = element.querySelectorAll("[data-char]");

    gsap.from(chars, {
      y: "100%",
      opacity: 0,
      duration,
      delay,
      stagger,
      ease: "power3.out",
    });
  });
}

/**
 * Hook for magnetic hover effect
 */
export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  strength: number = 0.3
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return elementRef;
}

/**
 * Hook for parallax scroll effect
 */
export function useParallax<T extends Element = HTMLDivElement>(
  speed: number = 0.5
) {
  return useGSAP<T>((ctx, element) => {
    gsap.to(element, {
      y: () => window.innerHeight * speed * -1,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

export { gsap, ScrollTrigger };
