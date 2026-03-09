import Greeting from "@/features/dashboard/components/Greeting";
import RecentSearches from "@/features/dashboard/components/RecentSearches";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | NutriLog",
  description:
    "NutriLog is a calorie tracker that helps you track your daily calorie intake and meal calories.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-4 md:py-10 px-4 md:px-6 max-w-4xl mx-auto">
      <Greeting />
      <RecentSearches />
    </div>
  );
}
