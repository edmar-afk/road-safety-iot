import React, { useEffect, useMemo, useState } from "react";
import api from "../assets/api";
import Sidebar from "../components/Sidebar";

function Riders() {
  const [riders, setRiders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/riders/");

      const users = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      // Extra frontend protection: never display superusers.
      setRiders(users.filter((user) => user.is_superuser !== true));
    } catch (err) {
      console.error("Failed to fetch riders:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load riders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const filteredRiders = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return riders.filter((rider) => {
      const fullName =
        `${rider.first_name || ""} ${rider.last_name || ""}`.trim();

      return (
        rider.username?.toLowerCase().includes(keyword) ||
        rider.email?.toLowerCase().includes(keyword) ||
        fullName.toLowerCase().includes(keyword)
      );
    });
  }, [riders, search]);

  const activeRiders = riders.filter((rider) => rider.is_active).length;
  const inactiveRiders = riders.length - activeRiders;

  const getInitials = (rider) => {
    const name = `${rider.first_name || ""} ${rider.last_name || ""}`.trim();

    return name
      ? name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : rider.username?.slice(0, 2).toUpperCase() || "R";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-72">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Management
              </p>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Riders
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage and monitor all registered rider accounts.
            </p>
          </div>

          <button
            onClick={fetchRiders}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-60"
          >
            <span>↻</span>
            Refresh Riders
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Total Riders
              </p>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
                👥
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              {riders.length}
            </h2>
            <p className="mt-1 text-xs text-slate-400">Registered accounts</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Active Riders
              </p>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
                ✓
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              {activeRiders}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Currently active accounts
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Inactive Riders
              </p>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-xl text-yellow-600">
                !
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              {inactiveRiders}
            </h2>
            <p className="mt-1 text-xs text-slate-400">Disabled accounts</p>
          </div>
        </div>

        {/* Riders Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Registered Riders
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                List of all non-administrator accounts
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
                placeholder="Search riders..."
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
            <table className="w-full min-w-[750px] text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4 font-bold">Rider</th>
                  <th className="px-6 py-4 font-bold">Username</th>
                  <th className="px-6 py-4 font-bold">Date Joined</th>
                  <th className="px-6 py-4 font-bold">Account Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />
                      <p className="mt-3 text-sm text-slate-500">
                        Loading riders...
                      </p>
                    </td>
                  </tr>
                ) : filteredRiders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="text-4xl">👥</div>
                      <p className="mt-3 font-semibold text-slate-700">
                        No riders found
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {search
                          ? "Try searching with another keyword."
                          : "There are currently no registered riders."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRiders.map((rider) => (
                    <tr key={rider.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 font-extrabold text-red-600">
                            {getInitials(rider)}
                          </div>

                          <div>
                            <p className="font-bold text-slate-800">
                              {`${rider.first_name || ""} ${rider.last_name || ""}`.trim() ||
                                rider.username}
                            </p>
                            <p className="text-xs text-slate-400">
                              Rider ID: #{rider.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        @{rider.username}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(rider.date_joined)}
                      </td>

                      <td className="px-6 py-4">
                        {rider.is_active ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredRiders.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-xs font-medium text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-800">
                  {filteredRiders.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">
                  {riders.length}
                </span>{" "}
                riders
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Riders;
