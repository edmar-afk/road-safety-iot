import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    password: "",
    password2: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "mobile_number"
          ? value.replace(/\D/g, "").slice(0, 15)
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const fullName = formData.full_name.trim();
    const mobileNumber = formData.mobile_number.trim();

    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^\d{10,15}$/.test(mobileNumber)) {
      setError(
        "Enter a valid mobile number using 10–15 digits, including your country code if needed.",
      );
      return;
    }

    if (formData.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.password2) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: fullName,
          username: mobileNumber,
          password: formData.password,
          password2: formData.password2,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const messages = Object.entries(data)
          .map(([field, value]) => {
            const detail = Array.isArray(value)
              ? value.join(" ")
              : String(value);

            const fieldNames = {
              username: "Mobile number",
              first_name: "Full name",
              password: "Password",
              password2: "Confirm password",
            };

            return `${fieldNames[field] || field}: ${detail}`;
          })
          .join("\n");

        throw new Error(messages || "Registration failed.");
      }

      setSuccess("Your Road Safety account has been created!");

      setFormData({
        full_name: "",
        mobile_number: "",
        password: "",
        password2: "",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-400/20 disabled:bg-slate-100";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      {/* Road-inspired background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="absolute right-8 top-0 hidden h-full w-24 -skew-x-12 border-x border-white/5 bg-white/[0.02] lg:block">
          <div className="mx-auto h-full w-1.5 border-x-2 border-dashed border-yellow-400/30" />
        </div>
      </div>

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-2">
        {/* Left: Road Safety branding */}
        <div className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-slate-900 p-10 text-white lg:flex xl:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black" />

          {/* Decorative road */}
          <div className="absolute -right-16 bottom-0 top-0 w-52 rotate-6 border-x-[18px] border-slate-700/40 bg-slate-800/60">
            <div className="mx-auto h-full w-1.5 border-x-2 border-dashed border-yellow-400/50" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-slate-950">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-7 w-7"
                >
                  <path d="M12 3 3.5 20h17L12 3Z" />
                  <path d="M12 9v5" />
                  <path d="M12 17h.01" />
                </svg>
              </div>

              <div>
                <p className="text-lg font-black tracking-wide">
                  ROAD <span className="text-yellow-400">SAFETY</span>
                </p>
                <p className="text-xs tracking-[0.2em] text-slate-400">
                  SMARTER ROADS. SAFER LIVES.
                </p>
              </div>
            </div>

            <div className="mt-20 max-w-md">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-300">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                Safety starts with you
              </p>

              <h1 className="text-5xl font-black leading-tight xl:text-6xl">
                Every journey
                <span className="block text-yellow-400">matters.</span>
              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
                Join Road Safety and help make every road journey safer through
                awareness, responsible driving, and better road safety
                reporting.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-16">
            <div className="mb-6 h-1.5 w-full rounded-full bg-slate-700">
              <div className="h-full w-1/3 rounded-full bg-yellow-400" />
            </div>

            <div className="flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-widest text-slate-400">
              <span>Stay alert</span>
              <span className="text-yellow-400">Stay safe</span>
              <span>Arrive alive</span>
            </div>
          </div>
        </div>

        {/* Right: Registration form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile branding */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-slate-950">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path d="M12 3 3.5 20h17L12 3Z" />
                  <path d="M12 9v5" />
                  <path d="M12 17h.01" />
                </svg>
              </div>

              <span className="font-black tracking-wide text-slate-900">
                ROAD <span className="text-yellow-600">SAFETY</span>
              </span>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-600">
                Join the community
              </p>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Create account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Register your details to get started with Road Safety.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  role="alert"
                  className="whitespace-pre-line rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  {success}
                </div>
              )}

              {/* Full name */}
              <div>
                <label htmlFor="full_name" className={labelClass}>
                  Full name
                </label>

                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                  </svg>

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>

              {/* Mobile number */}
              <div>
                <label htmlFor="mobile_number" className={labelClass}>
                  Mobile number
                </label>

                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  >
                    <rect x="6" y="2" width="12" height="20" rx="2" />
                    <path d="M11 18h2" />
                  </svg>

                  <input
                    id="mobile_number"
                    name="mobile_number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="e.g. 09171234567"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    required
                    maxLength={15}
                    disabled={loading}
                    className={`${inputClass} pl-12`}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  This number will be used as your login username.
                </p>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                  </svg>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                    disabled={loading}
                    className={`${inputClass} pl-12 pr-20`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 text-sm font-bold text-slate-500 transition hover:text-yellow-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="password2" className={labelClass}>
                  Confirm password
                </label>

                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                    <path d="m9 15 2 2 4-4" />
                  </svg>

                  <input
                    id="password2"
                    name="password2"
                    type={showPassword2 ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`${inputClass} pl-12 pr-20`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword2((prev) => !prev)}
                    className="absolute inset-y-0 right-3 text-sm font-bold text-slate-500 transition hover:text-yellow-700"
                  >
                    {showPassword2 ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-4 font-extrabold text-slate-950 shadow-lg shadow-yellow-400/20 transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Road Safety Account
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Already registered?{" "}
                <Link
                  to="/"
                  className="font-bold text-slate-900 underline decoration-yellow-400 decoration-2 underline-offset-4 transition hover:text-yellow-700"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Drive responsibly. Arrive safely.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
