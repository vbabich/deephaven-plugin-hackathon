import { useCallback, useEffect, useRef } from "react";

type PlayFn = (url?: string) => void;

const useAudioPlayer = (url?: string): [PlayFn] => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(url);
    document.body.appendChild(audioRef.current);
    return () => {
      if (audioRef.current) {
        document.body.removeChild(audioRef.current);
      }
      audioRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = url ?? "";
    }
  }, [url]);

  const play = useCallback((url?: string) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (url != null) {
      audio.src = url;
      audio.autoplay = true;
      audio.preload = "auto";
    }
    if (audio.paused) {
      audio.play();
    } else {
      audio.currentTime = 0;
    }
  }, []);

  return [play];
};

export default useAudioPlayer;
