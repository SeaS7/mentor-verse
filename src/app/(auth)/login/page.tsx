"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";

// Updated Zod Schema

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { errors } = form.formState; // Extract errors for easy access

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      form.setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });
    } else {
      router.replace("/");
    }
    setIsLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-none border border-gray-300 shadow-lg bg-white p-6 dark:border-neutral-700 dark:bg-black dark:shadow-input md:rounded-2xl md:p-8">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Login to MentorVerse
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Login to MentorVerse <br /> If you don&apos;t have an account,{" "}
        <Link href="/register" className="text-orange-500 hover:underline">
          Register
        </Link>{" "}
        with MentorVerse
      </p>

      <FormProvider {...form}>
        <form className="my-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Email Field */}
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <Input
                  className="text-black border border-gray-300 dark:text-white dark:border-neutral-700 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="projectmayhem@fc.com"
                  {...field}
                />
                {errors.identifier && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.identifier.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="off"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 px-3 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </FormItem>
            )}
          />

          <button
            className="relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white mt-4 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-neutral-600 dark:focus:ring-neutral-300"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in →"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
