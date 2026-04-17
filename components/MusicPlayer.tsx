"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

function PlayIcon({ className }: { className?: string }) {
  return (
    <div className={cn("w-8 h-8 flex items-center justify-center", className)}>
      <div
        className="w-0 h-0 ml-0.5"
        style={{
          borderTop: "8px solid transparent",
          borderBottom: "8px solid transparent",
          borderLeft: "14px solid currentColor",
        }}
      />
    </div>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <div className={cn("w-8 h-8 flex items-center justify-center gap-1", className)}>
      <div className="w-1 h-4 rounded-[2px] bg-current" />
      <div className="w-1 h-4 rounded-[2px] bg-current" />
    </div>
  );
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let interactionListener: (() => void) | null = null;

    // 尝试自动播放
    const attemptAutoplay = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
            // 自动播放被阻止，等待用户首次交互后自动播放
            interactionListener = () => {
              audio.play().then(() => setIsPlaying(true)).catch(() => {});
              document.removeEventListener("click", interactionListener!);
              document.removeEventListener("touchstart", interactionListener!);
            };
            document.addEventListener("click", interactionListener, { once: true });
            document.addEventListener("touchstart", interactionListener, { once: true });
          });
      }
    };

    if (audio.readyState >= 3) {
      attemptAutoplay();
    } else {
      audio.addEventListener("canplaythrough", attemptAutoplay, { once: true });
    }

    return () => {
      audio.removeEventListener("canplaythrough", attemptAutoplay);
      if (interactionListener) {
        document.removeEventListener("click", interactionListener);
        document.removeEventListener("touchstart", interactionListener);
      }
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("播放失败:", err);
        setIsPlaying(false);
      });
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/bg-music.mp3" loop preload="auto" />
      <button
        onClick={togglePlay}
        className={cn(
          "fixed top-10 left-0 z-50 w-[77px] h-[77px] lg:w-[90px] lg:h-[90px]",
          "flex items-center justify-center",
          "transition-transform duration-300 hover:scale-110",
          "focus:outline-none"
        )}
        aria-label={isPlaying ? "暂停背景音乐" : "播放背景音乐"}
        title={isPlaying ? "暂停背景音乐" : "播放背景音乐"}
      >
        {/* 旋转层：唱片/外圈装饰背景 */}
        <img
          src="/images/music/disc.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain animate-spin-slow p-1"
          style={{ animationPlayState: isPlaying ? "running" : "paused" }}
        />

        {/* 固定层：始终正向的播放/暂停符号 */}
        <div className="relative z-10 text-white/90">
          {isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </div>
      </button>
    </>
  );
}
