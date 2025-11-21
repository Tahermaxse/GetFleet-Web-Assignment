"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { Mail, Lock, Check, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { validateSession } from "@/lib/api/getfleet"
import { GETFLEET_STAGING_TOKEN } from "@/lib/constants"
import { clearSessionToken, setSessionToken } from "@/lib/session"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  agreeToTerms: z
    .boolean()
    .refine((value) => value, { message: "Please accept the Terms of Use to continue." }),
})

type LoginFormData = z.infer<typeof loginSchema>

const highlight = "bg-brand"

export default function LoginCard() {
  const [userType, setUserType] = useState<"admin" | "driver">("admin")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      agreeToTerms: true,
    },
  })

  const agreeToTerms = watch("agreeToTerms")

  const loginMutation = useMutation({
    mutationFn: async (_data: LoginFormData) => {
      const token = GETFLEET_STAGING_TOKEN
      setSessionToken(token)
      await validateSession(token)
      return token
    },
    onSuccess: () => {
      router.push("/dashboard")
    },
    onError: (error) => {
      console.error("Session validation failed", error)
      clearSessionToken()
    },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  const helperEmail = "johndoe@gmail.com"

  return (
    <div className="min-h-screen w-full bg-[#f7f8ff] flex items-center justify-center py-10 px-4">
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-4 -z-10 rounded-[40px] bg-white" />
        <div className="relative rounded-[24px] border border-gray-500/30 bg-white px-8 py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-28 w-full rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(99,91,255,0.12),_transparent_60%)]"
          >
            <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(90deg,rgba(99,91,255,0.08)_1px,transparent_1px),linear-gradient(rgba(99,91,255,0.08)_1px,transparent_1px)] bg-[size:26px_30px]" />
          </div>

          <div className="relative flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center">
              <Image src="/logo.png" alt="GetFleet logo" width={32} height={32} priority className="h-14 w-14" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-slate-900">Sign in to GetFleet</h1>
              <p className="mt-1 text-sm text-slate-500">
                Access your fleet. Track in real time.
                <br />
                Manage with precision.
              </p>
            </div>
          </div>

          <div className="relative mt-8 rounded-2xl bg-slate-100 p-1">
            {(["admin", "driver"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type)}
                className={`w-1/2 rounded-xl py-2 text-sm font-medium capitalize transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#635BFF]/80 ${userType === type ? `${highlight} text-white shadow` : "text-slate-500"
                  }`}
              >
                {type === "admin" ? "Admin" : "Drivers"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email <span className="text-[#635BFF]">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Your email"
                  {...register("email")}
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 pl-10 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#635BFF] focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]/40"
                />
              </div>
              {errors.email ? (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              ) : (
                <p className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] text-white">i</span>
                  {helperEmail}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your password"
                  {...register("password")}
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#635BFF] focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]/40"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#635BFF]/60"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-semibold text-slate-500 hover:text-[#635BFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#635BFF]/60"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="button"
              onClick={() => setValue("agreeToTerms", !agreeToTerms, { shouldValidate: true })}
              className="flex items-start gap-3 text-left text-sm text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#635BFF]/60"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${agreeToTerms ? "border-[#222222]" : "border-slate-300"
                  }`}
              >
                {agreeToTerms && <Check className="h-3 w-3 text-[#222222]" strokeWidth={3} />}
              </span>
              <span>
                I agree to the GetFleet Terms of Use and
                <br />
                Privacy Policy
              </span>
            </button>
            {errors.agreeToTerms && <p className="text-xs text-red-500">{errors.agreeToTerms.message}</p>}

            {loginMutation.isError && (
              <p className="text-sm text-red-500">
                Unable to validate your session. Please try again.
              </p>
            )}

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              aria-busy={loginMutation.isPending}
              className="mt-2 h-12 w-full rounded-2xl bg-[#635BFF] text-base font-semibold tracking-tight text-white shadow-[0_15px_30px_rgba(99,91,255,0.35)] transition hover:bg-[#5248d6] disabled:cursor-not-allowed disabled:bg-[#7f77ff]"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}