/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */

import { Link } from "react-router-dom";

import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  Activity,
  AlertTriangle,
  Clock3,
  Gauge,
  MapPin,
  ShieldCheck,
  Siren,
  Wifi,
  Zap,
} from "lucide-react";

import api from "../assets/api";

import UserLocationStatus from "../components/UserLocationStatus";

const DEFAULT_LATITUDE = 7.855729;

const DEFAULT_LONGITUDE = 123.160166;
const MAX_IMPACT_AGE_MS = 5 * 60 * 1000;

function getImpactLevel(gForce) {
  if (gForce < 2) {
    return {
      label: "Small Impact",

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

    bg: "bg-red-50",

    text: "text-red-700",

    border: "border-red-200",

    dot: "bg-red-500",

    darkBg: "bg-red-500/20",

    darkText: "text-red-400",
  };
}

function Dashboard() {
  const [impact, setImpact] = useState(null);

  const [loading, setLoading] = useState(true);

  const [connected, setConnected] = useState(false);

  const [apiError, setApiError] = useState("");

  // Current location of the person viewing this website.

  const [userLocation, setUserLocation] = useState(null);

  // ---------------------------------------------

  // Fetch latest impact from Django

  // ---------------------------------------------

  useEffect(() => {
    let active = true;

    const fetchImpact = async () => {
      try {
        const response = await api.get("/api/impact-logs/");
        if (!active) return;

        const logs = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.results)
            ? response.data.results
            : [];

        const sortedLogs = [...logs].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

        const latestLog = sortedLogs[0] || null;

        if (latestLog?.timestamp) {
          const timestamp = new Date(latestLog.timestamp).getTime();
          const age = Date.now() - timestamp;

          if (
            Number.isFinite(timestamp) &&
            age >= 0 &&
            age <= MAX_IMPACT_AGE_MS
          ) {
            setImpact(latestLog);
          } else {
            setImpact(null);
          }
        } else {
          setImpact(null);
        }

        setConnected(true);
        setApiError("");
      } catch (error) {
        if (!active) return;
        console.error("Failed to fetch impact logs:", error);
        setConnected(false);
        setApiError(
          error.response?.data?.detail ||
            error.response?.data?.error ||
            error.message ||
            "Unable to retrieve impact logs.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchImpact();
    const fetchInterval = setInterval(fetchImpact, 2000);

    const expirationInterval = setInterval(() => {
      setImpact((currentImpact) => {
        if (!currentImpact?.timestamp) return null;
        const timestamp = new Date(currentImpact.timestamp).getTime();
        const age = Date.now() - timestamp;

        if (!Number.isFinite(timestamp) || age < 0 || age > MAX_IMPACT_AGE_MS) {
          return null;
        }

        return currentImpact;
      });
    }, 1000);

    return () => {
      active = false;
      clearInterval(fetchInterval);
      clearInterval(expirationInterval);
    };
  }, []);

  // ---------------------------------------------
  // Impact information
  // ---------------------------------------------

  // ---------------------------------------------

  const gForce =
    impact?.g_force != null && Number.isFinite(Number(impact.g_force))
      ? Number(impact.g_force)
      : 0;

  const impactLevel = getImpactLevel(gForce);

  const severity =
    gForce >= 5
      ? "Critical"
      : gForce >= 3
        ? "Significant"
        : gForce >= 2
          ? "Moderate"
          : "Low";

  const hasImpact = impact?.impact_detected === true || gForce >= 2;

  const impactTime = impact?.timestamp
    ? new Date(impact.timestamp).toLocaleString()
    : "No impact data yet";

  const formatImpactTimestamp = (timestamp) => {
    if (!timestamp) return "No impact recorded";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "Invalid timestamp";

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const day = date.getDate();

    const year = date.getFullYear();

    const time = date

      .toLocaleString("en-US", {
        hour: "numeric",

        minute: "2-digit",

        hour12: true,
      })

      .toLowerCase()

      .replace(/\s/g, "");

    return `${month}. ${day}, ${year} - ${time}`;
  };

  // ---------------------------------------------

  // ESP32 GPS information

  // This remains separate from the viewer's location.

  // ---------------------------------------------

  const gpsFixValid = impact?.gps_fix_valid === true;

  const satellites = impact?.satellites ?? 0;

  const latitude = impact?.latitude ?? null;

  const longitude = impact?.longitude ?? null;

  const altitude = impact?.altitude_m ?? null;

  const speed = impact?.speed_kmph ?? null;

  const gpsDate = impact?.gps_date ?? "—";

  const gpsTime = impact?.gps_time_utc ?? "—";

  const gpsCharsProcessed = impact?.gps_chars_processed ?? 0;

  const hasCoordinates =
    gpsFixValid &&
    latitude !== null &&
    longitude !== null &&
    String(latitude).trim() !== "" &&
    String(longitude).trim() !== "" &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude)) &&
    Number(latitude) >= -90 &&
    Number(latitude) <= 90 &&
    Number(longitude) >= -180 &&
    Number(longitude) <= 180;

  // ---------------------------------------------

  // Map location selection

  //

  // Below 4G:

  // Valid ESP32 GPS -> default location

  //

  // At or above 4G:

  // Viewer location -> default location

  // ---------------------------------------------

  const useViewerLocation = gForce >= 4;

  const hasViewerCoordinates =
    userLocation !== null &&
    Number.isFinite(Number(userLocation.latitude)) &&
    Number.isFinite(Number(userLocation.longitude)) &&
    Number(userLocation.latitude) >= -90 &&
    Number(userLocation.latitude) <= 90 &&
    Number(userLocation.longitude) >= -180 &&
    Number(userLocation.longitude) <= 180;

  const mapLatitude = useViewerLocation
    ? hasViewerCoordinates
      ? Number(userLocation.latitude)
      : DEFAULT_LATITUDE
    : hasCoordinates
      ? Number(latitude)
      : DEFAULT_LATITUDE;

  const mapLongitude = useViewerLocation
    ? hasViewerCoordinates
      ? Number(userLocation.longitude)
      : DEFAULT_LONGITUDE
    : hasCoordinates
      ? Number(longitude)
      : DEFAULT_LONGITUDE;

  const mapLocationLabel = useViewerLocation
    ? hasViewerCoordinates
      ? "Showing the viewer's current location"
      : "Default location — viewer location unavailable"
    : hasCoordinates
      ? "Showing the latest valid ESP32 GPS coordinates"
      : "Showing the default location until GPS fix is available";

  const googleMapsUrl = `https://www\.google.com/maps?q=${mapLatitude},${mapLongitude}&t=k`;

  const formatNumber = (value, decimals = 2) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      !Number.isFinite(Number(value))
    ) {
      return "—";
    }

    return Number(value).toFixed(decimals);
  };

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

          <Link
            to="/logout"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
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
              {loading
                ? "Connecting..."
                : connected
                  ? "Connected"
                  : "Disconnected"}
            </span>
          </div>
        </section>

        {/* ================= API ERROR ================= */}

        {apiError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Unable to retrieve sensor data</p>

            <p className="mt-1 break-words">{apiError}</p>

            <p className="mt-2 text-xs">
              Check the Django endpoint and the PythonAnywhere error log.
            </p>
          </div>
        )}

        {/* ================= IMPACT ALERT ================= */}

        {hasImpact && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
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

        <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]">
          {/* ================= VIEWER LOCATION + MAP ================= */}

          <div className="min-w-0 space-y-4">
            <UserLocationStatus compact onLocationChange={setUserLocation} />

            {/* ================= MAP ================= */}

            <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900">
                    Accident Location
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {mapLocationLabel}
                  </p>

                  {useViewerLocation && (
                    <p className="mt-1 text-xs font-medium text-amber-700">
                      {hasViewerCoordinates
                        ? "Impact is at least 4G. The map is using the viewer's location."
                        : "Impact is at least 4G, but viewer location is unavailable. Using the default location."}
                    </p>
                  )}
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 sm:self-auto"
                >
                  <MapPin size={14} />
                  Open Maps
                </a>
              </div>

              {/* Embedded Google Map */}

              <div className="relative h-[320px] overflow-hidden bg-[#e9eef0] sm:h-[400px]">
                <iframe
                  key={`${mapLatitude},${mapLongitude}`}
                  title="Accident Location Satellite Map"
                  className="absolute inset-0 h-full w-full border-0"
                  src={`https://maps.google.com/maps?q=${mapLatitude},${mapLongitude}&t=k&z=19&output=embed`}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Latest impact information */}

                <div className="absolute bottom-3 left-3 z-10 max-w-[220px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl sm:bottom-5 sm:left-5 sm:max-w-[300px] sm:p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Latest Impact
                  </p>

                  <h4 className="mt-1 text-sm font-bold text-slate-900">
                    {hasImpact ? impactLevel.label : "No Impact Detected"}
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    {hasImpact
                      ? `${gForce.toFixed(2)} G detected`
                      : "Waiting for sensor data"}
                  </p>
                </div>

                {/* Impact level legend */}

                <div className="absolute bottom-3 right-3 z-10 rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-lg sm:bottom-5 sm:right-5 sm:p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Impact Level
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-700">
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

              {/* Selected map coordinates */}

              <div className="break-words border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                <div>
                  <span className="font-semibold text-slate-700">
                    Latitude:
                  </span>{" "}
                  {mapLatitude.toFixed(6)}
                  <span className="mx-2 sm:mx-3">|</span>
                  <span className="font-semibold text-slate-700">
                    Longitude:
                  </span>{" "}
                  {mapLongitude.toFixed(6)}
                </div>

                <p className="mt-1 text-slate-500">{mapLocationLabel}</p>
              </div>
            </div>
          </div>

          {/* ================= LIVE SENSOR ================= */}

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
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

                  {/* WHEN IT HAPPENED */}

                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock3 size={14} />

                      <span className="text-xs">When It Happened</span>
                    </div>

                    <p className="mt-2 text-sm font-bold leading-relaxed text-white">
                      {formatImpactTimestamp(impact?.timestamp)}
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

                {/* WIFI */}

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-xs font-semibold">Wi-Fi</p>

                    <p className="text-[11px] text-slate-400">
                      API data transmission
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

        {/* ================= ESP32 GPS DETAILS ================= */}
      </main>
    </div>
  );
}

export default Dashboard;
