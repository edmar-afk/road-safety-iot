import React, { useEffect, useMemo, useState } from "react";
import api from "../assets/api";
import Sidebar from "../components/Sidebar";

function IncidentLogs() {
  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIncidents = async () => {
    try {
      if (incidents.length === 0) {
        setLoading(true);
      }
      setError("");

      const response = await api.get("/api/impact-logs/");

      const logs = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setIncidents(logs);
    } catch (err) {
      console.error("Failed to fetch incident logs:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load incident logs. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();

    const interval = setInterval(() => {
      fetchIncidents();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return incidents.filter((incident) => {
      const username =
        typeof incident.user === "object"
          ? incident.user?.username || ""
          : incident.username || "";

      return (
        String(incident.id || "")
          .toLowerCase()
          .includes(keyword) ||
        String(username).toLowerCase().includes(keyword) ||
        String(incident.g_force ?? "")
          .toLowerCase()
          .includes(keyword) ||
        String(incident.timestamp || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [incidents, search]);

  const getSeverity = (gForce) => {
    const value = Number(gForce);

    if (value >= 4) {
      return {
        label: "Critical",
        style: "bg-red-50 text-red-700",
      };
    }

    if (value >= 2) {
      return {
        label: "High",
        style: "bg-orange-50 text-orange-700",
      };
    }

    if (value >= 1) {
      return {
        label: "Moderate",
        style: "bg-yellow-50 text-yellow-700",
      };
    }

    return {
      label: "Low",
      style: "bg-green-50 text-green-700",
    };
  };

  const criticalCount = incidents.filter(
    (incident) => Number(incident.g_force) >= 4,
  ).length;

  const highCount = incidents.filter(
    (incident) => Number(incident.g_force) >= 2 && Number(incident.g_force) < 4,
  ).length;

  const moderateCount = incidents.filter(
    (incident) => Number(incident.g_force) >= 1 && Number(incident.g_force) < 2,
  ).length;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <>
      <Sidebar />

      <div className="ml-0 min-h-screen bg-slate-100 p-4 sm:p-6 lg:ml-72 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Monitoring
              </p>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Incident Logs
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor and review recorded rider impact incidents.
            </p>
          </div>

          <button
            onClick={fetchIncidents}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-60"
          >
            <span>↻</span>
            Refresh Incidents
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Total Incidents
              </p>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
                ⚠
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              {incidents.length}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Recorded impact incidents
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Critical Incidents
              </p>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
                !
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              {criticalCount}
            </h2>

            <p className="mt-1 text-xs text-slate-400">4G and above</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                High Incidents
              </p>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl text-orange-600">
                ▲
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              {highCount}
            </h2>

            <p className="mt-1 text-xs text-slate-400">2G to below 4G</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Moderate Incidents
              </p>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-xl text-yellow-600">
                ◷
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              {moderateCount}
            </h2>

            <p className="mt-1 text-xs text-slate-400">1G to below 2G</p>
          </div>
        </div>

        {/* Incident Logs Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recorded Incidents
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                History of detected rider impact events
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search incidents..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10"
              />
            </div>
          </div>

          {error && (
            <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4 font-bold">Incident</th>
                  <th className="px-6 py-4 font-bold">Rider</th>
                  <th className="px-6 py-4 font-bold">Impact Force</th>
                  <th className="px-6 py-4 font-bold">Date Recorded</th>
                  <th className="px-6 py-4 font-bold">Severity</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading incident logs...
                      </p>
                    </td>
                  </tr>
                ) : filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="text-4xl">⚠</div>

                      <p className="mt-3 font-semibold text-slate-700">
                        No incidents found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {search
                          ? "Try searching with another keyword."
                          : "There are currently no recorded incidents."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((incident) => {
                    const severity = getSeverity(incident.g_force);

                    const username =
                      typeof incident.user === "object"
                        ? incident.user?.username
                        : incident.username;

                    return (
                      <tr
                        key={incident.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-800">
                              Incident #{incident.id}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Impact detection record
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-700">
                            {username || "Unknown rider"}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-extrabold text-slate-800">
                            {incident.g_force != null
                              ? `${Number(incident.g_force).toFixed(2)} G`
                              : "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(incident.timestamp)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${severity.style}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {severity.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredIncidents.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-xs font-medium text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-800">
                  {filteredIncidents.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">
                  {incidents.length}
                </span>{" "}
                incidents
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default IncidentLogs;
