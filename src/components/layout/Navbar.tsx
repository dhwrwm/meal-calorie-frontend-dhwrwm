import { playfairDisplay } from "@/lib/fonts";
import ThemeToggle from "../theme/ThemeToggle";
import AuthNav from "./AuthNav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 shadow-md bg-muted">
      <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 font-bold text-xl">
          <div className="w-8.5 h-8.5 rounded-[10px] bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--secondary)))] flex items-center justify-center text-[16px] shadow-[0_2px_8px_hsl(var(--primary)/0.3)]">
            🥗
          </div>
          <div
            className={`hidden md:block text-xl font-bold ${playfairDisplay.className} text-foreground leading-[1.1]`}
          >
            NutriLog
            <div
              className={`text-[9px] tracking-[0.06em] text-muted-foreground uppercase`}
            >
              Calorie Tracker
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2 ">
          <AuthNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
