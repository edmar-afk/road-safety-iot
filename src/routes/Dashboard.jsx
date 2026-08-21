/* eslint-disable no-unused-vars */

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  ChevronRight,
  Clock3,
  Gauge,
  MapPin,
  ShieldCheck,
  Siren,
  Wifi,
  Zap,
} from "lucide-react";

const IMPACT_API = "https://roadsafety.pythonanywhere.com/api/log-impact/";

function getImpactLevel(gForce) {
  if (gForce < 2) {
    return {
      label: "Small Impact",
      color: "emerald",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      darkBg: "bg-emerald-500/20",
      darkText: "text-emerald-400",
    };
  }

  if (gForce < 3) {
    return {
      label: "Moderate Impact",
      color: "yellow",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      dot: "bg-yellow-500",
      darkBg: "bg-yellow-500/20",
      darkText: "text-yellow-400",
    };
  }

  if (gForce < 8) {
    return {
      label: "Significant Impact",
      color: "orange",
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      dot: "bg-orange-500",
      darkBg: "bg-orange-500/20",
      darkText: "text-orange-400",
    };
  }

  return {
    label: "Critical Impact",
    color: "red",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    darkBg: "bg-red-500/20",
    darkText: "text-red-400",
  };
}

function SeverityBadge({ severity }) {
  const styles = {
    Critical: "bg-red-50 text-red-700 border-red-200",
    Significant: "bg-orange-50 text-orange-700 border-orange-200",
    Moderate: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const dots = {
    Critical: "bg-red-500",
    Significant: "bg-orange-500",
    Moderate: "bg-yellow-500",
    Low: "bg-emerald-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[severity]
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[severity]}`} />

      {severity}
    </span>
  );
}

function Dashboard() {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  // ---------------------------------------------
  // Fetch latest impact
  // ---------------------------------------------

  const fetchImpact = async () => {
    try {
      const response = await fetch(IMPACT_API);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setImpact(data);
      setConnected(true);
    } catch (error) {
      console.error("Failed to fetch impact:", error);

      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // Poll Django every 2 seconds
  // ---------------------------------------------

  useEffect(() => {
    fetchImpact();

    const interval = setInterval(() => {
      fetchImpact();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------
  // Calculate impact information
  // ---------------------------------------------

  const gForce = impact?.g_force ? Number(impact.g_force) : 0;

  const impactLevel = getImpactLevel(gForce);

  const severity =
    gForce >= 5
      ? "Critical"
      : gForce >= 3
        ? "Significant"
        : gForce >= 2
          ? "Moderate"
          : "Low";

  const hasImpact = gForce >= 2;

  const impactTime = impact?.timestamp
    ? new Date(impact.timestamp).toLocaleString()
    : "No impact data yet";

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="flex h-[76px] items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
              <Siren size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Smart Road <span className="text-red-500">Safety</span>
              </h1>

              <p className="text-xs text-slate-500">
                IoT Safety Monitoring System
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-6 p-6 lg:p-8">
        {/* ================= PAGE INTRO ================= */}

        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-1 text-sm font-medium text-red-500">
              REAL-TIME MONITORING
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Accident Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitor the safety of your loved ones in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm">
            <Clock3 size={16} className="text-slate-400" />

            <span className="font-medium">Live Sensor</span>

            <span className="text-slate-400">•</span>

            <span className={connected ? "text-emerald-600" : "text-red-500"}>
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </section>

        {/* ================= IMPACT ALERT ================= */}

        {hasImpact && (
          <motion.section
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className={`relative overflow-hidden rounded-2xl border ${impactLevel.border} ${impactLevel.bg} p-5 shadow-sm`}
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 ${impactLevel.dot}`}
            />

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${impactLevel.darkBg} ${impactLevel.darkText}`}
                >
                  <AlertTriangle size={24} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${impactLevel.text}`}
                    >
                      Impact Detected
                    </span>

                    <span
                      className={`rounded-full ${impactLevel.dot} px-2.5 py-1 text-[10px] font-bold text-white`}
                    >
                      {impactLevel.label.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="mt-1 text-lg font-bold">
                    {impactLevel.label}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {impactTime}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Zap size={14} />
                      Impact: <strong>{gForce.toFixed(2)} G</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ================= MAIN CONTENT ================= */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]">
          {/* ================= MAP ================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h3 className="font-bold text-slate-900">Accident Location</h3>

                <p className="mt-1 text-xs text-slate-500">
                  GPS will be added later
                </p>
              </div>
            </div>

            {/* Fake map for now */}

            <div className="relative h-[400px] overflow-hidden bg-[#e9eef0]">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(#cbd5d8 1px, transparent 1px), linear-gradient(90deg, #cbd5d8 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />

              <div className="absolute left-[15%] top-[-20%] h-[150%] w-12 rotate-[25deg] bg-white shadow-sm" />

              <div className="absolute left-[-10%] top-[55%] h-10 w-[130%] rotate-[-8deg] bg-white shadow-sm" />

              <div className="absolute left-[55%] top-[-10%] h-[130%] w-8 rotate-[62deg] bg-white shadow-sm" />

              {hasImpact && (
                <motion.button
                  animate={{
                    scale: [1, 1.12, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                  }}
                  className={`absolute left-[45%] top-[40%] flex h-12 w-12 items-center justify-center rounded-full ${impactLevel.darkBg}`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${impactLevel.dot} text-white shadow-lg`}
                  >
                    <Siren size={15} />
                  </span>
                </motion.button>
              )}

              <div className="absolute bottom-5 left-5 max-w-[300px] rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Latest Impact
                </p>

                <h4 className="mt-1 text-sm font-bold">
                  {hasImpact ? impactLevel.label : "No Impact Detected"}
                </h4>

                <p className="mt-1 text-xs text-slate-500">
                  {hasImpact
                    ? `${gForce.toFixed(2)} G detected`
                    : "Waiting for sensor data"}
                </p>

                <div className="mt-3">
                  <SeverityBadge severity={severity} />
                </div>
              </div>

              {/* Legend */}

              <div className="absolute bottom-5 right-5 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Impact Level
                </p>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Small
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                    Moderate
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    Significant
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    Critical
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= LIVE SENSOR ================= */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h3 className="font-bold">Live Sensor Data</h3>
              </div>

              <div
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  connected
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <Wifi size={13} />

                {connected ? "Connected" : "Disconnected"}
              </div>
            </div>

            <div className="p-5">
              {/* SENSOR SUMMARY */}

              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Current Status</p>

                    <p className="mt-1 text-xl font-bold">
                      {loading
                        ? "Loading..."
                        : hasImpact
                          ? impactLevel.label
                          : "Monitoring"}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      hasImpact ? impactLevel.darkBg : "bg-emerald-500/20"
                    } ${hasImpact ? impactLevel.darkText : "text-emerald-400"}`}
                  >
                    <ShieldCheck size={21} />
                  </div>
                </div>

                {/* SENSOR CARDS */}

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {/* SPEED */}

                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Gauge size={14} />

                      <span className="text-xs">Speed</span>
                    </div>

                    <p className="mt-2 text-2xl font-bold">
                      —
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        km/h
                      </span>
                    </p>
                  </div>

                  {/* IMPACT */}

                  <div
                    className={`rounded-xl p-3 ${
                      hasImpact ? impactLevel.darkBg : "bg-white/5"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        hasImpact ? impactLevel.darkText : "text-slate-400"
                      }`}
                    >
                      <Zap size={14} />

                      <span className="text-xs">Impact</span>
                    </div>

                    <p
                      className={`mt-2 text-2xl font-bold ${
                        hasImpact ? impactLevel.darkText : "text-white"
                      }`}
                    >
                      {loading ? "—" : gForce.toFixed(2)}

                      <span className="ml-1 text-xs font-normal text-slate-400">
                        G
                      </span>
                    </p>
                  </div>

                  {/* ACCELERATION */}

                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Activity size={14} />

                      <span className="text-xs">Acceleration</span>
                    </div>

                    <p className="mt-2 text-2xl font-bold">
                      {gForce ? (gForce * 9.81).toFixed(2) : "—"}

                      <span className="ml-1 text-xs font-normal text-slate-400">
                        m/s²
                      </span>
                    </p>
                  </div>

                  {/* BATTERY */}

                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <BatteryCharging size={14} />

                      <span className="text-xs">Battery</span>
                    </div>

                    <p className="mt-2 text-2xl font-bold">
                      —
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        %
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* SENSOR READINGS */}

              <div className="mt-5 space-y-3">
                {/* MPU6050 */}

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-xs font-semibold">Accelerometer</p>

                    <p className="text-[11px] text-slate-400">MPU6050</p>
                  </div>

                  <span
                    className={`text-xs font-bold ${
                      hasImpact ? impactLevel.text : "text-emerald-600"
                    }`}
                  >
                    {hasImpact ? impactLevel.label : "Normal"}
                  </span>
                </div>

                {/* GPS */}

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-xs font-semibold">GPS</p>

                    <p className="text-[11px] text-slate-400">
                      GPS not connected yet
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    Pending
                  </span>
                </div>

                {/* WIFI */}

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-xs font-semibold">GSM / WiFi</p>

                    <p className="text-[11px] text-slate-400">
                      Data transmission
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold ${
                      connected ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {connected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
