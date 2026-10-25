import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuthData } from "../utils/auth";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "username"
          ? value.replace(/\D/g, "").slice(0, 15)
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const mobileNumber = formData.username.trim();

    if (!/^\d{10,15}$/.test(mobileNumber)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: mobileNumber,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid mobile number or password.");
        }

        const firstError = Object.values(data)
          .flat()
          .find((value) => typeof value === "string");

        throw new Error(
          firstError || "Login failed. Please try again."
        );
      }

      // Save the Django User and JWT tokens.
      saveAuthData(data);

      // Redirect after successful login.
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      {/* Background road markings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-full w-40 -rotate-12 border-x-2 border-slate-800 bg-slate-900/40" />
        <div className="absolute -right-20 top-0 h-full w-40 rotate-12 border-x-2 border-slate-800 bg-slate-900/40" />

        <div className="absolute left-1/2 top-0 h-full -translate-x-1/2">
          <div className="flex h-full flex-col items-center gap-8 opacity-20">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-12 w-1.5 rounded-full bg-yellow-400"
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10 shadow-lg shadow-yellow-400/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-yellow-400"
            >
              <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-yellow-400">
            Road Safety System
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Welcome <span className="text-yellow-400">Back</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to access your Road Safety account.
          </p>
        </div>

        {/* Login form */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Sign in to your account
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter your registered mobile number and password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Mobile Number
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <path d="M12 18h.01" />
                  </svg>
                </span>

                <input
                  id="username"
                  name="username"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="Enter your mobile number"
                  value={formData.username}
                  onChange={handleChange}
                  pattern="[0-9]{10,15}"
                  minLength={10}
                  maxLength={15}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use the same mobile number you registered with.
              </p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Password
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-20 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  className="absolute inset-y-0 right-3 text-sm font-semibold text-yellow-400 transition hover:text-yellow-300 disabled:opacity-50"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-yellow-400 px-4 py-3.5 font-bold text-slate-950 shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
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
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-800 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-yellow-400 transition hover:text-yellow-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-yellow-400"
          >
            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          </svg>
          Secure account access · Road Safety
        </div>
      </div>
    </div>
  );
}
