import { Metadata } from "next";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register | NutriLog",
  description:
    "NutriLog is a calorie tracker that helps you track your daily calorie intake and meal calories.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
