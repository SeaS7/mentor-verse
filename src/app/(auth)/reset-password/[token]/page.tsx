"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

// Zod schema for validation
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});

export default function ResetPassword() {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setMessage(null);
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/users/reset-password", {
        token,
        newPassword: data.password,
      });
      setMessage(response.data.message || "Password reset successfully.");
      router.replace("/login");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setMessage(axiosError.response?.data.message || "Failed to reset password. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     <div className="mx-auto w-full max-w-md border border-gray-300 shadow-lg bg-white p-6 dark:border-gray-700 dark:bg-black dark:shadow-input md:rounded-2xl md:p-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-800 dark:text-gray-200">
            Reset Password
          </h1>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Enter your new password below.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">New Password</FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      autoComplete="off"
                      className="dark:text-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white mt-4 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-neutral-600 dark:focus:ring-neutral-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("success") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
  );
}
