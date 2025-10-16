'use client'

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CircularCursor() {
  const bigBallRef = useRef<HTMLDivElement>(null);
  const smallBallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bigBall = bigBallRef.current;
    const smallBall = smallBallRef.current;
    const hoverables = document.querySelectorAll<HTMLElement>('.hoverable');

    if (!bigBall || !smallBall) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(bigBall, { x: e.pageX - 15, y: e.pageY - 15, duration: 0.4 });
      gsap.to(smallBall, { x: e.pageX - 5, y: e.pageY - 7, duration: 0.1 });
    };

    const onMouseHover = () => gsap.to(bigBall, { scale: 4, duration: 0.3 });
    const onMouseHoverOut = () => gsap.to(bigBall, { scale: 1, duration: 0.3 });

    document.body.addEventListener('mousemove', onMouseMove);
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', onMouseHover);
      el.addEventListener('mouseleave', onMouseHoverOut);
    });

    return () => {
      document.body.removeEventListener('mousemove', onMouseMove);
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', onMouseHover);
        el.removeEventListener('mouseleave', onMouseHoverOut);
      });
    };
  }, []);

  return (
    <div className="pointer-events-none">
      <div
        ref={bigBallRef}
        className="fixed top-0 left-0 w-[30px] h-[30px] z-[1000] mix-blend-difference flex items-center justify-center"
      >
        <svg height="30" width="30">
          <circle cx="15" cy="15" r="12" fill="#f7f8fa" strokeWidth={0}></circle>
        </svg>
      </div>

      <div
        ref={smallBallRef}
        className="fixed top-0 left-0 w-[10px] h-[10px] z-[1000] mix-blend-difference flex items-center justify-center"
      >
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="4" fill="#f7f8fa" strokeWidth={0}></circle>
        </svg>
      </div>
    </div>
  );
}
