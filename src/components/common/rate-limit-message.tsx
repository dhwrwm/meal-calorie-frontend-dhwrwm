"use client";

import FormHelperText from "@/components/ui/form-helper-text";
import { useRetryCountdown } from "@/hooks/use-retry-countdown";

interface RateLimitMessageProps {
  seconds: number;
}

const RateLimitMessage = ({ seconds }: RateLimitMessageProps) => {
  const { secondsLeft, isActive } = useRetryCountdown(seconds);

  const minutesRemaining = Math.floor(secondsLeft / 60);
  const secondRemaining = secondsLeft % 60;
  const formattedTime = `${minutesRemaining}:${secondRemaining
    .toString()
    .padStart(2, "0")}`;

  return isActive ? (
    <FormHelperText error className="text-center text-sm">
      Too many requests from this IP. Try again in {formattedTime}
    </FormHelperText>
  ) : null;
};

export default RateLimitMessage;
