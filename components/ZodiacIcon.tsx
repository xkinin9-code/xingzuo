"use client";

import { cn } from "@/lib/utils";

interface ZodiacIconProps {
  zodiacName: string;
  className?: string;
}

const zodiacOrder = [
  "白羊座",
  "金牛座",
  "双子座",
  "巨蟹座",
  "狮子座",
  "处女座",
  "天秤座",
  "天蝎座",
  "射手座",
  "摩羯座",
  "水瓶座",
  "双鱼座",
];

export default function ZodiacIcon({ zodiacName, className }: ZodiacIconProps) {
  const index = zodiacOrder.indexOf(zodiacName);
  if (index === -1) return null;

  return (
    <div
      className={cn("relative overflow-hidden shrink-0", className)}
      aria-label={`${zodiacName}图标`}
    >
      <img
        src="/images/icons/zodiac-symbols.png"
        alt={`${zodiacName}图标`}
        className="absolute top-0 h-full max-w-none"
        style={{
          width: `${zodiacOrder.length * 100}%`,
          left: 0,
          transform: `translateX(-${(index / zodiacOrder.length) * 100}%)`,
        }}
      />
    </div>
  );
}
