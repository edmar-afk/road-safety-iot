/* eslint-disable no-unused-vars */

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gauge,
  MapPin,
  Navigation,
  Radio,
  ShieldCheck,
  Siren,
  Smartphone,
  TrendingUp,
  User,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

const accidentData = [
  {
    id: "ACC-2026-0810",
    severity: "Critical",
    type: "High Impact Collision",
    location: "Poblacion, Guipos, Zamboanga del Sur",
    time: "2 mins ago",
    speed: 72,
    impact: 8.7,
    latitude: 7.7162,
    longitude: 123.3198,
    status: "Emergency Response",
  },
];

function SeverityBadge({ severity }) {
  const styles = {
    Critical: "bg-red-50 text-red-700 border-red-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[severity]
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          severity === "Critical"
            ? "bg-red-500"
            : severity === "Moderate"
              ? "bg-amber-500"
              : "bg-blue-500"
        }`}
      />
      {severity}
    </span>
  );
}

function Dashboard() {
  const [selectedAccident, setSelectedAccident] = useState(accidentData[0]);

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
              Monitor the safety of your love ones in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm">
            <Clock3 size={16} className="text-slate-400" />
            <span className="font-medium">August 10, 2026</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-600">Live</span>
          </div>
        </section>

        {/* ================= ACTIVE ACCIDENT ALERT ================= */}
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-white p-5 shadow-sm"
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle size={24} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                    Active Accident Detected
                  </span>

                  <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white">
                    HIGH PRIORITY
                  </span>
                </div>

                <h3 className="mt-1 text-lg font-bold">
                  High Impact Collision
                </h3>

                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    Around Lakewood
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={14} />2 minutes ago
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Zap size={14} />
                    Impact: 8.7 G
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedAccident(accidentData[0])}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
            >
              View Incident
              <ChevronRight size={17} />
            </button>
          </div>
        </motion.section>

        {/* ================= MAIN CONTENT ================= */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]">
          {/* ================= MAP ================= */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h3 className="font-bold text-slate-900">Accident Location</h3>

                <p className="mt-1 text-xs text-slate-500">
                  Real-time incident positioning
                </p>
              </div>
            </div>

            {/* Fake map for now */}
            <div className="relative h-[400px] overflow-hidden bg-[#e9eef0]">
              {/* map grid */}
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(#cbd5d8 1px, transparent 1px), linear-gradient(90deg, #cbd5d8 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />

              {/* fake roads */}
              <div className="absolute left-[15%] top-[-20%] h-[150%] w-12 rotate-[25deg] bg-white shadow-sm" />
              <div className="absolute left-[-10%] top-[55%] h-10 w-[130%] rotate-[-8deg] bg-white shadow-sm" />
              <div className="absolute left-[55%] top-[-10%] h-[130%] w-8 rotate-[62deg] bg-white shadow-sm" />

              {/* incident markers */}
              <motion.button
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                onClick={() => setSelectedAccident(accidentData[0])}
                className="absolute left-[45%] top-[40%] flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-300">
                  <Siren size={15} />
                </span>
              </motion.button>

              {/* selected marker info */}
              <div className="absolute bottom-5 left-5 max-w-[300px] rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-[150px]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                      Selected Incident
                    </p>

                    <h4 className="mt-1 text-sm font-bold">
                      {selectedAccident.type}
                    </h4>

                    <p className="mt-1 mb-3 text-xs text-slate-500 break-words">
                      {selectedAccident.location}
                    </p>
                    <SeverityBadge severity={selectedAccident.severity} />
                  </div>
                </div>
              </div>

              {/* map legend */}
              <div className="absolute bottom-5 right-5 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Severity
                </p>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    Critical
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    Moderate
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    Low
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

              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                <Wifi size={13} />
                Connected
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Current Status</p>
                    <p className="mt-1 text-xl font-bold">Monitoring</p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck size={21} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Gauge size={14} />
                      <span className="text-xs">Speed</span>
                    </div>

                    <p className="mt-2 text-2xl font-bold">
                      72
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        km/h
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Zap size={14} />
                      <span className="text-xs">Impact</span>
                    </div>

                    <p className="mt-2 text-2xl font-bold">
                      8.7
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        G
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Activity size={14} />
                      <span className="text-xs">Acceleration</span>
                    </div>

                    <p className="mt-2 text-2xl font-bold">
                      4.8
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        m/s²
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <BatteryCharging size={14} />
                      <span className="text-xs">Battery</span>
                    </div>

                    <p className="mt-2 text-2xl font-bold">
                      92
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        %
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* sensor readings */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-xs font-semibold">Accelerometer</p>
                    <p className="text-[11px] text-slate-400">MPU6050</p>
                  </div>

                  <span className="text-xs font-bold text-emerald-600">
                    Normal
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-xs font-semibold">GPS</p>
                    <p className="text-[11px] text-slate-400">
                      7.7162, 123.3198
                    </p>
                  </div>

                  <span className="text-xs font-bold text-emerald-600">
                    Locked
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-xs font-semibold">GSM / WiFi</p>
                    <p className="text-[11px] text-slate-400">
                      Data transmission
                    </p>
                  </div>

                  <span className="text-xs font-bold text-emerald-600">
                    Connected
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
