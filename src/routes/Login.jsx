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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.username.trim() || !formData.password) {
      setError("Please enter your username and password.");
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
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.detail ||
          data.error ||
          data.non_field_errors?.[0] ||
          "Invalid username or password.";

        throw new Error(errorMessage);
      }

      // Make sure the backend returned user information.
      if (!data.user || !data.user.id) {
        console.error("Login response is missing user information:", data);

        throw new Error(
          "Login successful, but user information was not returned. Check your Django JWT serializer.",
        );
      }

      // Save access and refresh tokens.
      // Save access and refresh tokens.
      saveAuthData(data);

      // Save user information separately.
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      const savedUserInfo = JSON.parse(localStorage.getItem("userInfo"));

      console.log("Successfully logged in!");
      console.log("User Info:", savedUserInfo);
      console.log("User ID:", savedUserInfo.id);
      console.log("Username:", savedUserInfo.username);

      // Redirect based on user role.
      if (savedUserInfo.is_superuser === true) {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-400">Log in to your account</p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Mobile number or username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter mobile number or username"
              autoComplete="username"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-red-500 hover:text-red-400"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
