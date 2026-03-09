import { useEffect, useState } from "react";

export function useRetryCountdown(seconds: number) {
  const [secondsLeft, setSecondsLeft] = useState<number>(seconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, secondsLeft]);

  return {
    secondsLeft,
    isActive: secondsLeft > 0,
  };
}
