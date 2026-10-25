import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  LocateFixed,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Clock3,
  Navigation,
} from "lucide-react";

export default function UserLocationStatus({
  onLocationChange,
  compact = false,
}) {
  const [status, setStatus] = useState("requesting");
  const [position, setPosition] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const latestPositionRef = useRef(null);
  const watchIdRef = useRef(null);
  const mountedRef = useRef(false);
  const callbackRef = useRef(onLocationChange);

  useEffect(() => {
    callbackRef.current = onLocationChange;
  }, [onLocationChange]);

  const publishLocation = useCallback((result) => {
    if (!result?.coords) {
      callbackRef.current?.(null);
      return;
    }

    const latitude = result.coords.latitude;
    const longitude = result.coords.longitude;

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      callbackRef.current?.(null);
      return;
    }

    callbackRef.current?.({
      latitude,
      longitude,
      accuracy: result.coords.accuracy,
    });
  }, []);

  const stopWatching = useCallback(() => {
    if (
      watchIdRef.current !== null &&
      typeof navigator !== "undefined" &&
      navigator.geolocation
    ) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      setStatus("unsupported");
      setError("Your browser does not support location services.");
      setRefreshing(false);
      setPosition(null);
      latestPositionRef.current = null;
      callbackRef.current?.(null);
      return;
    }

    if (
      typeof window !== "undefined" &&
      !window.isSecureContext
    ) {
      setStatus("error");
      setError(
        "Location access requires HTTPS or localhost. Open this site using a secure connection."
      );
      setRefreshing(false);
      setPosition(null);
      latestPositionRef.current = null;
      callbackRef.current?.(null);
      return;
    }

    stopWatching();

    setStatus("requesting");
    setError("");
    setRefreshing(true);

    navigator.geolocation.getCurrentPosition(
      (result) => {
        if (!mountedRef.current) return;

        latestPositionRef.current = result;
        setPosition(result);
        setLastUpdated(new Date());
        setStatus("enabled");
        setError("");
        setRefreshing(false);
        publishLocation(result);

        // Continue monitoring changes to the viewer's location.
        stopWatching();

        watchIdRef.current = navigator.geolocation.watchPosition(
          (updatedPosition) => {
            if (!mountedRef.current) return;

            latestPositionRef.current = updatedPosition;
            publishLocation(updatedPosition);
          },
          (watchError) => {
            if (!mountedRef.current) return;

            if (watchError.code === 1) {
              setStatus("denied");
              setError(
                "Location permission was denied. Allow location access in your browser's site settings, then try again."
              );
              setPosition(null);
              latestPositionRef.current = null;
              callbackRef.current?.(null);
              setRefreshing(false);
              stopWatching();
            } else if (watchError.code === 2) {
              setStatus("error");
              setError(
                "Your device cannot determine its current location. Check that location services are enabled."
              );
              setPosition(null);
              latestPositionRef.current = null;
              callbackRef.current?.(null);
              setRefreshing(false);
              stopWatching();
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000,
          }
        );
      },
      (locationError) => {
        if (!mountedRef.current) return;

        setRefreshing(false);
        setPosition(null);
        latestPositionRef.current = null;
        callbackRef.current?.(null);

        if (locationError.code === 1) {
          setStatus("denied");
          setError(
            "Location permission was denied. Allow location access in your browser's site settings, then try again."
          );
        } else if (locationError.code === 2) {
          setStatus("error");
          setError(
            "Your location is unavailable. Turn on your device's location services and try again."
          );
        } else if (locationError.code === 3) {
          setStatus("error");
          setError(
            "Location request timed out. Check your GPS or location settings and retry."
          );
        } else {
          setStatus("error");
          setError("Unable to get your current location.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  }, [publishLocation, stopWatching]);

  useEffect(() => {
    mountedRef.current = true;

    requestLocation();

    // Refresh the displayed position every five seconds.
    const refreshInterval = window.setInterval(() => {
      if (!mountedRef.current || !latestPositionRef.current) return;

      const latest = latestPositionRef.current;

      setPosition(latest);
      setLastUpdated(new Date());
      publishLocation(latest);
    }, 5000);

    return () => {
      mountedRef.current = false;
      window.clearInterval(refreshInterval);
      stopWatching();
    };
  }, [requestLocation, publishLocation, stopWatching]);

  const latitude = position?.coords?.latitude;
  const longitude = position?.coords?.longitude;
  const accuracy = position?.coords?.accuracy;

  const formatCoordinate = (value) =>
    Number.isFinite(value) ? value.toFixed(6) : "—";

  const mapsUrl =
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : null;

  const isEnabled =
    status === "enabled" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div
        className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${
          compact ? "p-4" : "p-5"
        }`}
      >
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`relative flex shrink-0 items-center justify-center rounded-xl bg-slate-50 ${
              compact ? "h-10 w-10" : "h-12 w-12"
            }`}
          >
            <MapPin
              size={compact ? 20 : 23}
              className={
                isEnabled ? "text-emerald-600" : "text-slate-500"
              }
            />

            {isEnabled && (
              <span className="absolute right-0 top-0 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">
                Your Device Location
              </h3>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isEnabled
                    ? "bg-emerald-50 text-emerald-700"
                    : status === "requesting"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isEnabled
                      ? "bg-emerald-500"
                      : status === "requesting"
                        ? "animate-pulse bg-blue-500"
                        : "bg-amber-500"
                  }`}
                />

                {isEnabled
                  ? "GPS Enabled"
                  : status === "requesting"
                    ? "Requesting Access"
                    : status === "denied"
                      ? "Permission Needed"
                      : status === "unsupported"
                        ? "Not Supported"
                        : "Location Unavailable"}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {isEnabled
                ? "Your device location is being monitored."
                : status === "requesting"
                  ? "Allow location access when your browser asks."
                  : "Enable location access to share your current device position with this page."}
            </p>
          </div>
        </div>

        {!isEnabled && (
          <button
            type="button"
            onClick={requestLocation}
            disabled={refreshing || status === "unsupported"}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <LocateFixed size={16} />
            )}

            {refreshing ? "Requesting..." : "Enable Location"}
          </button>
        )}
      </div>

      {/* {isEnabled && (
        <div
          className={`border-t border-slate-100 ${
            compact ? "p-4" : "p-5"
          }`}
        >
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-emerald-700">
            <ShieldCheck size={17} />
            <span>Location access is active</span>

            <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <RefreshCw size={12} />
              Updates every 5 seconds
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Latitude
              </p>
              <p className="mt-2 break-all text-base font-bold text-slate-900">
                {formatCoordinate(latitude)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Longitude
              </p>
              <p className="mt-2 break-all text-base font-bold text-slate-900">
                {formatCoordinate(longitude)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Navigation size={13} />
                Accuracy
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {Number.isFinite(accuracy)
                  ? `±${Math.round(accuracy)} m`
                  : "—"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock3 size={13} />
              Last UI update:{" "}
              {lastUpdated
                ? lastUpdated.toLocaleTimeString()
                : "Waiting for location"}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={requestLocation}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh now
              </button>

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <MapPin size={14} />
                  View on Maps
                </a>
              )}
            </div>
          </div>
        </div>
      )} */}

      {/* {!isEnabled && error && (
        <div className="border-t border-amber-100 bg-amber-50/70 px-5 py-4">
          <div className="flex items-start gap-2 text-sm text-amber-800">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>

          {status === "denied" && (
            <p className="mt-2 pl-6 text-xs leading-5 text-amber-700">
              Open the site settings using the icon beside your browser's
              address bar, change Location to Allow, then press Enable
              Location again. A button cannot override a browser permission
              that has already been blocked.
            </p>
          )}
        </div>
      )}

      <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
        Location is used in this page to select the map position.
      </p> */}
    </motion.section>
  );
}