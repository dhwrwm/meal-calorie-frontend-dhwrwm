"use client";

import { useAuthStore } from "@/store/auth.store";
import { useGreeting } from "../hooks/useGreeting";
import { dmSans, playfairDisplay } from "@/lib/fonts";

export default function Greeting() {
  const user = useAuthStore((s) => s.user);
  const { greeting, icon, sub, dateDayString } = useGreeting();

  return (
    <>
      <div>
        <p className="uppercase text-muted-foreground">{dateDayString}</p>
        <h1
          className={`text-3xl font-bold text-foreground ${playfairDisplay.className}`}
        >
          Good {greeting} {icon}
          <br />
          <em className="text-primary italic">{user?.first_name} 👋</em>
        </h1>
      </div>
      {/* Divider */}
      <div className="fade-up-3 my-4">
        <div
          className="line-expand h-px w-[80%]"
          style={{
            background:
              "linear-gradient(to right, hsl(28 65% 55%), transparent)",
          }}
        />
      </div>

      {/* Subtext */}
      <p
        className={`fade-up-4 ${dmSans.className} text-base font-light max-w-xs`}
        style={{ color: "hsl(30 18% 48%)", lineHeight: 1.7 }}
      >
        {sub}
      </p>
    </>
  );
}
