import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../assets/api";

export default function SmsScheduler() {
  const location = useLocation();
  const isSending = useRef(false);

  useEffect(() => {
    const allowedRoutes = [
      "/admin-dashboard",
      "/riders",
      "/sms-logs",
      "/incident-logs",
    ];

    if (!allowedRoutes.includes(location.pathname)) return;

    let mounted = true;

    const sendSMS = async () => {
      if (isSending.current || !mounted) return;

      isSending.current = true;

      try {
        const response = await api.post("/api/send-sms/");

        console.log("SMS Scheduler:", response.data);
      } catch (error) {
        console.error(
          "SMS Scheduler Error:",
          error.response?.data || error.message,
        );
      } finally {
        isSending.current = false;
      }
    };

    sendSMS();

    const interval = setInterval(sendSMS, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [location.pathname]);

  return null;
}
