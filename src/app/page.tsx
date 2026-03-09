"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NutriLog",
  description:
    "NutriLog is a calorie tracker that helps you track your daily calorie intake and meal calories.",
};

export default function HomePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [token, router]);

  return null;
}
