import dayjs from "@/lib/dayjs";

export function useGreeting() {
  const hour = dayjs().hour();

  if (hour < 12) {
    return {
      greeting: "morning",
      icon: "🌤️",
      sub: "Hope your day is off to a great start.",
      dateDayString: dayjs().format("dddd, MMM D"),
    };
  }

  if (hour < 17) {
    return {
      greeting: "afternoon",
      icon: "☀️",
      sub: "Keep the momentum going.",
      dateDayString: dayjs().format("dddd, MMM D"),
    };
  }

  return {
    greeting: "evening",
    icon: "🌙",
    sub: "Time to wind down and reflect.",
    dateDayString: dayjs().format("dddd, MMM D"),
  };
}
