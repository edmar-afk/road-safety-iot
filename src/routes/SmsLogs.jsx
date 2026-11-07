import React, { useEffect, useMemo, useState } from "react";
import api from "../assets/api";
import Sidebar from "../components/Sidebar";

function SmsLogs() {
  const [smsLogs, setSmsLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSmsLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/sms-logs/");

      const logs = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setSmsLogs(logs);
    } catch (err) {
      console.error("Failed to fetch SMS logs:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load SMS logs. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmsLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return smsLogs.filter((log) => {
      return (
        String(log.phone_number || log.mobile_number || "")
          .toLowerCase()
          .includes(keyword) ||
        String(log.message || log.message_content || "")
          .toLowerCase()
          .includes(keyword) ||
        String(log.status || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [smsLogs, search]);

  const sentCount = smsLogs.filter(
    (log) => String(log.status).toLowerCase() === "sent",
  ).length;

  const failedCount = smsLogs.filter(
    (log) => String(log.status).toLowerCase() === "failed",
  ).length;

  const pendingCount = smsLogs.filter(
    (log) => String(log.status).toLowerCase() === "pending",
  ).length;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "sent":
        return "bg-green-50 text-green-700";

      case "failed":
        return "bg-red-50 text-red-700";

      case "pending":
        return "bg-yellow-50 text-yellow-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
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
              SMS Logs
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor and review all outgoing SMS notifications.
            </p>
          </div>

          <button
            onClick={fetchSmsLogs}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-60"
          >
            <span>↻</span>
            Refresh Logs
          </button>
        </div>

        {/* Statistics */}
        

        {/* SMS Logs Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                SMS Notification History
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Records of outgoing SMS messages and delivery status
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
                placeholder="Search SMS logs..."
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
                  <th className="px-6 py-4 font-bold">Recipient</th>
                  <th className="px-6 py-4 font-bold">Message</th>
                  <th className="px-6 py-4 font-bold">Date Sent</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />
                      <p className="mt-3 text-sm text-slate-500">
                        Loading SMS logs...
                      </p>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="text-4xl">✉</div>
                      <p className="mt-3 font-semibold text-slate-700">
                        No SMS logs found
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {search
                          ? "Try searching with another keyword."
                          : "There are currently no SMS notification records."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-extrabold text-md text-red-800">
                            ALERT MESSAGE
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            SMS ID: #{log.id}
                          </p>
                        </div>
                      </td>

                      <td className="max-w-md px-6 py-4">
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">
                          {log.content || "No message content"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(
                          log.timestamp || log.created_at || log.date_sent,
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize text-green-700`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {log.status || "sent"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredLogs.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-xs font-medium text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-800">
                  {filteredLogs.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">
                  {smsLogs.length}
                </span>{" "}
                SMS logs
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SmsLogs;
