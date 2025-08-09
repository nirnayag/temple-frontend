import React from "react";
import { useTranslation } from "react-i18next";

function useHelpers() {
  const { i18n } = useTranslation();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "mr" ? "mr-IN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString(i18n.language === "mr" ? "mr-IN" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  return {
    formatDate,
    formatTime,
  };
}

export default useHelpers;
