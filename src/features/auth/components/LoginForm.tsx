"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import FormHelperText from "@/components/ui/form-helper-text";
import { LoginFormValues, loginSchema } from "../schemas/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInput from "@/components/ui/passord-input";
import { useLogin } from "../hooks/use-login";
import RateLimitMessage from "@/components/common/rate-limit-message";

const LoginForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { login, isLoading, error } = useLogin();

  const onLogin = async (values: LoginFormValues) => {
    login(values);
  };

  return (
    <form onSubmit={handleSubmit(onLogin)} className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue tracking your meals and calories.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full"
            helperText={errors?.email?.message ?? ""}
            error={!!errors?.email}
            {...register("email")}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Password
          </label>
          <PasswordInput
            placeholder="Enter your password"
            className="w-full"
            helperText={errors?.password?.message ?? ""}
            error={!!errors?.password}
            {...register("password")}
          />
        </div>
      </div>

      {!error?.retryAfter && (
        <FormHelperText error className="text-center">
          {error?.message}
        </FormHelperText>
      )}

      {error?.retryAfter && <RateLimitMessage seconds={error.retryAfter} />}

      <Button
        isSubmit
        isLoading={isLoading}
        disabled={isLoading}
        className="mt-2 w-full gap-2 py-3 text-sm font-semibold uppercase tracking-wide"
      >
        <span>{isLoading ? "Signing in..." : "Sign in"}</span>
      </Button>
      <p className="text-center">
        Create an account? <a href="/register">Sign up</a>
      </p>
    </form>
  );
};

export default LoginForm;
