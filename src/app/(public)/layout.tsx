export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col items-center py-4">
      <div className="w-50 h-50 text-[120px] rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--secondary)))] flex items-center justify-center shadow-[0_2px_8px_hsl(var(--primary)/0.3)] mb-6">
        🥗
      </div>

      <div className="w-full max-w-md rounded-2xl md:border md:border-border md:bg-card p-4 md:p-6 md:shadow-lg">
        {children}
      </div>
    </div>
  );
}
