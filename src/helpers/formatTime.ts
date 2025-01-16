import { format } from "date-fns";
import { isRTL } from "./flexDirection";

export const formatDuration = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  } else {
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
};

export const formatPrayerTime = (time: string) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const parsedTime = new Date(`${today} ${time}`);

  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const isAM = hours < 12;

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const arPeriod = isAM ? "ص" : "م";
  const enPeriod = isAM ? "AM" : "PM";

  return `${formattedHours}:${formattedMinutes} ${isRTL ? arPeriod : enPeriod}`;
};
