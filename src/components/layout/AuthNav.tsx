"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useMealStore } from "@/store/meal.store";

export default function AuthNav() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const clearSearches = useMealStore((s) => s.clearSearches);

  const handleLogout = () => {
    logout();
    clearSearches();
    router.replace("/login");
  };

  if (!user) {
    return <></>;
  }

  return (
    <>
      <Link
        href="/dashboard"
        className="text-sm font-medium mr-4 hover:text-primary hidden md:block"
      >
        Dashboard
      </Link>
      <Link
        href="/calories"
        className="text-sm font-medium mr-4 hover:text-primary hidden md:block"
      >
        Calories
      </Link>
      <div className="hidden md:flex h-8.5 w-8.5 rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--secondary)))] items-center justify-center text-[16px] shadow-[0_2px_8px_hsl(var(--primary)/0.3)] text-accent">
        {user.first_name[0]}
      </div>
      <Button variant="ghost" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}
