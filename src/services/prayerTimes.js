import { format } from "date-fns";
import { isRTL } from "../helpers/flexDirection";

export async function getPrayerTimes({ latitude, longitude }) {
  try {
    const today = format(new Date(), "yyyy-MM-dd");

    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData?.data;
    }

    const data = await response.json();

    const timings = data.data.timings;

    const formatTime = (time) => {
      const formatted = format(new Date(`${today} ${time}`), "hh:mm a");
      return isRTL
        ? formatted.replace("AM", "ص").replace("PM", "م")
        : formatted;
    };

    const prayerTimes = {
      fajr: formatTime(timings.Fajr),
      dhuhr: formatTime(timings.Dhuhr),
      asr: formatTime(timings.Asr),
      maghrib: formatTime(timings.Maghrib),
      isha: formatTime(timings.Isha),
    };

    return prayerTimes;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error;
  }
}

export function getNextPrayer(prayerTimes) {
  const now = new Date();
  const currentTime = format(now, "HH:mm");

  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ];

  // Find the next prayer
  for (const prayer of prayers) {
    if (prayer.time > currentTime) {
      return prayer;
    }
  }

  // If no next prayer today, return first prayer of next day
  return prayers[0];
}

export function calculateRemainingTime(times, nextPrayer) {
  if (!times || !nextPrayer) return null;

  const now = new Date();

  const prayerTimeStr = times[nextPrayer.name.toLowerCase()];
  const isPM = isRTL
    ? prayerTimeStr.includes("م")
    : prayerTimeStr.includes("PM");
  const [timePart] = prayerTimeStr.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);

  // Convert to 24-hour format
  let prayerHours = hours;
  if (isPM && hours !== 12) {
    prayerHours += 12;
  }
  if (!isPM && hours === 12) {
    prayerHours = 0;
  }

  const prayerTime = new Date();
  prayerTime.setHours(prayerHours, minutes, 0);

  if (prayerTime < now) {
    prayerTime.setDate(prayerTime.getDate() + 1);
  }

  // Calculate the remaining time
  const diff = prayerTime - now;
  const hours_remaining = Math.floor(diff / (1000 * 60 * 60));
  const minutes_remaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds_remaining = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: hours_remaining,
    minutes: minutes_remaining,
    seconds: seconds_remaining,
  };
}

export function isPrayerTime(currentTime, prayerTimes) {
  return Object.values(prayerTimes).includes(currentTime);
}
