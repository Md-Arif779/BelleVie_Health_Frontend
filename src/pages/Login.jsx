
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Lock,
  User,
  Eye,
  EyeOff,
  Activity,
  AlertCircle,
  Loader2,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  Building2,
} from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login(username.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Invalid username or password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(135deg, #D9F7E8 0%, #F2F2F2 48%, #EAF2FF 100%)",
      }}
    >
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-40"
          style={{ background: "#BDEFD5" }}
        />

        <div
          className="absolute -bottom-40 -right-32 w-96 h-96 rounded-full opacity-40"
          style={{ background: "#CFE0FF" }}
        />

        <div
          className="absolute top-1/3 right-[8%] hidden xl:block w-24 h-24 rounded-full opacity-30"
          style={{ background: "#D9F7E8" }}
        />
      </div>

      {/* Main */}
      <div className="relative z-10 w-full max-w-[1120px]">

        <div className="bg-white/95 backdrop-blur-sm rounded-[28px] shadow-[0_25px_70px_rgba(33,33,33,0.12)] border border-white overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">

            {/* =====================================================
                BRAND PANEL
            ====================================================== */}
            <div
              className="hidden lg:flex relative overflow-hidden min-h-[650px] xl:min-h-[680px] p-10 xl:p-14 flex-col justify-between"
              style={{
                background:
                  "linear-gradient(145deg, #2F6FED 0%, #245ED2 55%, #194CB5 100%)",
              }}
            >

              {/* Decorative shapes */}
              <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full border-[55px] border-white/10" />

              <div className="absolute -bottom-40 -left-36 w-[430px] h-[430px] rounded-full border-[70px] border-white/10" />

              <div className="absolute top-[42%] -right-16 w-40 h-40 rounded-full bg-white/5" />

              {/* small medical icons */}
              <div className="absolute top-28 right-16 opacity-10">
                <HeartPulse className="w-24 h-24 text-white" />
              </div>

              <div className="absolute bottom-36 right-28 opacity-10">
                <Stethoscope className="w-20 h-20 text-white" />
              </div>

              {/* Brand */}
              <div className="relative z-10">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg">

                    <Activity
                      className="w-6 h-6"
                      style={{ color: "#2F6FED" }}
                    />

                  </div>

                  <div>

                    <h1 className="text-xl font-bold text-white tracking-tight">
                      BelleVie Health
                    </h1>

                    <p className="text-xs text-white/70 mt-0.5">
                      Healthcare Management System
                    </p>

                  </div>

                </div>

              </div>

              {/* Main content */}
              <div className="relative z-10 max-w-[460px]">

                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/15 mb-6">

                  <ShieldCheck className="w-4 h-4 text-white" />

                  <span className="text-xs font-semibold text-white">
                    Secure Staff Portal
                  </span>

                </div>

                <h2 className="text-[40px] xl:text-[46px] font-bold text-white leading-[1.1] tracking-tight">

                  Smarter healthcare.
                  <br />

                  <span className="text-white/65">
                    Better management.
                  </span>

                </h2>

                <p className="text-sm xl:text-[15px] text-white/70 leading-6 mt-6 max-w-[410px]">

                  A centralized platform for managing members,
                  healthcare providers, appointments, medical records
                  and daily healthcare operations.

                </p>

                {/* Feature cards */}
                <div className="grid grid-cols-3 gap-3 mt-8">

                  <div className="rounded-xl bg-white/10 border border-white/10 p-3.5">

                    <HeartPulse className="w-5 h-5 text-white mb-3" />

                    <p className="text-[11px] font-semibold text-white">
                      Healthcare
                    </p>

                    <p className="text-[10px] text-white/55 mt-1">
                      Management
                    </p>

                  </div>

                  <div className="rounded-xl bg-white/10 border border-white/10 p-3.5">

                    <Building2 className="w-5 h-5 text-white mb-3" />

                    <p className="text-[11px] font-semibold text-white">
                      Providers
                    </p>

                    <p className="text-[10px] text-white/55 mt-1">
                      & Partners
                    </p>

                  </div>

                  <div className="rounded-xl bg-white/10 border border-white/10 p-3.5">

                    <ShieldCheck className="w-5 h-5 text-white mb-3" />

                    <p className="text-[11px] font-semibold text-white">
                      Secure
                    </p>

                    <p className="text-[10px] text-white/55 mt-1">
                      Access
                    </p>

                  </div>

                </div>

              </div>

              {/* Footer */}
              <div className="relative z-10">

                <div className="h-px bg-white/15 mb-4" />

                <div className="flex items-center justify-between gap-4">

                  <p className="text-[11px] text-white/50 leading-5">
                    Authorized personnel only
                  </p>

                  <div className="flex items-center gap-2 text-white/50">

                    <ShieldCheck className="w-3.5 h-3.5" />

                    <span className="text-[10px]">
                      Protected Session
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* =====================================================
                LOGIN PANEL
            ====================================================== */}
            <div className="flex items-center justify-center">

              <div className="w-full max-w-[500px] px-6 py-8 sm:px-10 sm:py-11 md:px-12 lg:px-12 xl:px-16">

                {/* Mobile brand */}
                <div className="lg:hidden flex justify-center sm:justify-start mb-9">

                  <div className="flex items-center gap-3">

                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: "#D9F7E8" }}
                    >
                      <Activity
                        className="w-5 h-5"
                        style={{ color: "#2F6FED" }}
                      />
                    </div>

                    <div>

                      <h1
                        className="text-xl font-bold"
                        style={{ color: "#212121" }}
                      >
                        BelleVie{" "}
                        <span style={{ color: "#2F6FED" }}>
                          Health
                        </span>
                      </h1>

                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: "#7A7A7A" }}
                      >
                        Healthcare Management System
                      </p>

                    </div>

                  </div>

                </div>

                {/* Header */}
                <div className="mb-7">

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: "#D9F7E8",
                      boxShadow: "0 8px 20px rgba(47,111,237,0.08)",
                    }}
                  >
                    <Lock
                      className="w-5 h-5"
                      style={{ color: "#2F6FED" }}
                    />
                  </div>

                  <h2
                    className="text-2xl sm:text-3xl font-bold tracking-tight"
                    style={{ color: "#212121" }}
                  >
                    Welcome back
                  </h2>

                  <p
                    className="text-sm mt-2 leading-5"
                    style={{ color: "#7A7A7A" }}
                  >
                    Sign in to continue to your BelleVie Health dashboard.
                  </p>

                </div>

                {/* Error */}
                {error && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">

                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />

                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-red-700">
                        Sign in failed
                      </p>

                      <p className="text-xs text-red-600 mt-1 leading-5 break-words">
                        {error}
                      </p>

                    </div>

                  </div>
                )}

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* Username */}
                  <div>

                    <label
                      htmlFor="username"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "#212121" }}
                    >
                      Username
                    </label>

                    <div className="relative">

                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-[19px] h-[19px] pointer-events-none"
                        style={{ color: "#7A7A7A" }}
                      />

                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        autoComplete="username"
                        required
                        disabled={isSubmitting}
                        className="w-full h-[52px] pl-11 pr-4 rounded-xl text-sm outline-none transition-all border focus:ring-4 disabled:cursor-not-allowed"
                        style={{
                          color: "#212121",
                          borderColor: "#EEEEEE",
                          background: "#FFFFFF",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#2F6FED";
                          e.currentTarget.style.boxShadow =
                            "0 0 0 4px rgba(47,111,237,0.10)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#EEEEEE";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />

                    </div>

                  </div>

                  {/* Password */}
                  <div>

                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "#212121" }}
                    >
                      Password
                    </label>

                    <div className="relative">

                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-[19px] h-[19px] pointer-events-none"
                        style={{ color: "#7A7A7A" }}
                      />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        disabled={isSubmitting}
                        className="w-full h-[52px] pl-11 pr-12 rounded-xl text-sm outline-none transition-all border disabled:cursor-not-allowed"
                        style={{
                          color: "#212121",
                          borderColor: "#EEEEEE",
                          background: "#FFFFFF",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#2F6FED";
                          e.currentTarget.style.boxShadow =
                            "0 0 0 4px rgba(47,111,237,0.10)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#EEEEEE";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        disabled={isSubmitting}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        style={{ color: "#7A7A7A" }}
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between gap-4 pt-1">

                    <label className="flex items-center gap-2 cursor-pointer select-none">

                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ accentColor: "#2F6FED" }}
                      />

                      <span
                        className="text-xs sm:text-sm"
                        style={{ color: "#7A7A7A" }}
                      >
                        Remember me
                      </span>

                    </label>

                    <button
                      type="button"
                      className="text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap"
                      style={{ color: "#2F6FED" }}
                      onClick={() => {}}
                    >
                      Forgot password?
                    </button>

                  </div>

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[52px] mt-2 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "#2F6FED",
                      boxShadow: "0 8px 20px rgba(47,111,237,0.20)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.background = "#245ED2";
                        e.currentTarget.style.boxShadow =
                          "0 10px 24px rgba(47,111,237,0.28)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#2F6FED";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(47,111,237,0.20)";
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                      </>
                    )}
                  </button>

                </form>

                {/* Security */}
                <div
                  className="mt-6 flex items-start gap-3 p-4 rounded-xl border"
                  style={{
                    background: "#F8FAFC",
                    borderColor: "#EEEEEE",
                  }}
                >

                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "#D9F7E8" }}
                  >
                    <ShieldCheck
                      className="w-4 h-4"
                      style={{ color: "#2F6FED" }}
                    />
                  </div>

                  <div>

                    <p
                      className="text-xs font-semibold"
                      style={{ color: "#212121" }}
                    >
                      Secure access
                    </p>

                    <p
                      className="text-[11px] leading-5 mt-0.5"
                      style={{ color: "#7A7A7A" }}
                    >
                      Your session is protected with secure authentication.
                    </p>

                  </div>

                </div>

                {/* Copyright */}
                <p
                  className="text-center text-[10px] sm:text-[11px] mt-7"
                  style={{ color: "#9A9A9A" }}
                >
                  © {new Date().getFullYear()} BelleVie Health Care Ltd.
                  All rights reserved.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;

