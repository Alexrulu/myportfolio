// components/text-generate-effect.tsx
"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  highlights = [],
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  highlights?: string[];
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration: duration ?? 1, delay: stagger(0.2) }
    );
  }, [scope.current]);

  return (
    <div className={cn(className)}>
      <motion.div ref={scope} className="leading-relaxed">
        {wordsArray.map((word, idx) => {
          const isHighlighted = highlights.includes(word)
          return (
            <motion.span
              key={word + idx}
              className={cn(
                "opacity-0",
                isHighlighted
                  ? "text-foreground-principal font-medium"
                  : "text-foreground-secondary"
              )}
              style={{ filter: filter ? "blur(10px)" : "none" }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    </div>
  );
};