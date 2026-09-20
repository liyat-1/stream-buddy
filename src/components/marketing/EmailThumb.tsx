import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** Natural render width of every email preview. */
export const EMAIL_WIDTH = 460;

/**
 * Scales a full email preview down to a thumbnail width while keeping its
 * complete height — nothing is cropped or squashed.
 */
export function EmailThumb({
  width = 230,
  children,
  className = "",
}: {
  width?: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height / (width / EMAIL_WIDTH));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const imgs = Array.from(el.querySelectorAll("img"));
    imgs.forEach((img) => img.addEventListener("load", measure));
    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", measure));
    };
  }, [width, children]);

  const scale = width / EMAIL_WIDTH;

  return (
    <div className={`overflow-hidden ${className}`} style={{ width, height: height * scale }}>
      <div
        ref={ref}
        style={{ width: EMAIL_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}
