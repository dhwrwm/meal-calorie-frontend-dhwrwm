"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import FormHelperText from "@/components/ui/form-helper-text";
import { registerSchema } from "../schemas/register.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues } from "../schemas/register.schema";
import PasswordInput from "@/components/ui/passord-input";
import { useRegister } from "../hooks/use-register";
import RateLimitMessage from "@/components/common/rate-limit-message";

const RegisterForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const { register: onRegister, isLoading, error } = useRegister();

  const onSubmit = async (values: RegisterFormValues) => {
    onRegister({
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign up to continue tracking your meals and calories.
        </p>
      </div>

      <div className="space-y-2 md:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-foreground">
              First Name
            </label>
            <Input
              type="text"
              placeholder="Enter your first name"
              className="w-full"
              helperText={errors?.firstName?.message ?? ""}
              error={!!errors?.firstName}
              {...register("firstName")}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-foreground">
              Last Name
            </label>
            <Input
              type="text"
              placeholder="Enter your last name"
              className="w-full"
              helperText={errors?.lastName?.message ?? ""}
              error={!!errors?.lastName}
              {...register("lastName")}
            />
          </div>
        </div>

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

        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Repeat Password
          </label>
          <PasswordInput
            placeholder="Enter your password"
            className="w-full"
            helperText={errors?.repeatPassword?.message ?? ""}
            error={!!errors?.repeatPassword}
            {...register("repeatPassword")}
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
        <span>{isLoading ? "Signing up..." : "Sign up"}</span>
      </Button>
      <p className="text-center">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </form>
  );
};

export default RegisterForm;
