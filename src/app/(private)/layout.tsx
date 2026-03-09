"use client";

import { useAuthGuard } from "@/hooks/use-auth-guard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthed = useAuthGuard();

  if (!isAuthed) return null;

  return <>{children}</>;
}
