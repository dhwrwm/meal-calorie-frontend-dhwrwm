import { Metadata } from "next";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Login | NutriLog",
  description:
    "NutriLog is a calorie tracker that helps you track your daily calorie intake and meal calories.",
};

export default function LoginPage() {
  return <LoginForm />;
}
