"use client";

import {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Children,
} from "react";

type InfiniteMarqueeProps = {
  children: ReactNode;
  speed?: number;
  gap?: number;
  pauseOnHover?: boolean;
};

export function InfiniteMarquee({
  children,
  speed = 35,
  gap = 32,
  pauseOnHover = true,
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const offset = useRef(0);
  const period = useRef(0);
  const last = useRef(0);
  const animation = useRef<number>(0);

  const [paused, setPaused] = useState(false);

  const itemCount = Children.count(children);

  const measure = () => {
    if (!trackRef.current) return;
    const secondBlockFirstChild = trackRef.current.children[itemCount] as
      HTMLElement | undefined;

    if (secondBlockFirstChild) {
      period.current = secondBlockFirstChild.offsetLeft;
    }
  };

  useLayoutEffect(() => {
    measure();
  }, [children, itemCount]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const loop = (time: number) => {
      if (!last.current) last.current = time;

      const delta = (time - last.current) / 1000;
      last.current = time;

      if (!paused && period.current > 0) {
        offset.current += speed * delta;

        if (offset.current >= period.current) {
          offset.current -= period.current;
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-offset.current}px,0,0)`;
        }
      }

      animation.current = requestAnimationFrame(loop);
    };

    animation.current = requestAnimationFrame(loop);

    return () => {
      if (animation.current) cancelAnimationFrame(animation.current);
    };
  }, [paused, speed]);

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center overflow-hidden w-full"
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex w-max"
        style={{
          gap,
          willChange: "transform",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
