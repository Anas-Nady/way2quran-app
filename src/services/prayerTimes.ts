import { format } from "date-fns";
import { INextPrayer, IPrayerTimes, IRemainingTime } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const PERMISSION_KEY = "locationPermission";

export const requestLocationPermission = async () => {
  try {
    const storedStatus = await AsyncStorage.getItem(PERMISSION_KEY);
    if (storedStatus === "granted") return true;

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      await AsyncStorage.setItem(PERMISSION_KEY, "granted");
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

interface IGetPrayerTimes {
  latitude: number;
  longitude: number;
}
export async function getPrayerTimes({
  latitude,
  longitude,
}: IGetPrayerTimes): Promise<IPrayerTimes> {
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

    // Format the times to HH:mm format
    const prayerTimes = {
      fajr: format(new Date(`${today} ${timings.Fajr}`), "HH:mm"),
      dhuhr: format(new Date(`${today} ${timings.Dhuhr}`), "HH:mm"),
      asr: format(new Date(`${today} ${timings.Asr}`), "HH:mm"),
      maghrib: format(new Date(`${today} ${timings.Maghrib}`), "HH:mm"),
      isha: format(new Date(`${today} ${timings.Isha}`), "HH:mm"),
    };

    return prayerTimes;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error;
  }
}

export function getNextPrayer(prayerTimes: IPrayerTimes): INextPrayer {
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

export function calculateRemainingTime(
  times: IPrayerTimes,
  nextPrayer: INextPrayer
): IRemainingTime {
  if (!times || !nextPrayer) return null;

  const now = new Date();
  const [hours, minutes] = times[nextPrayer.name.toLowerCase()]
    .split(":")
    .map(Number);
  const prayerTime = new Date();
  prayerTime.setHours(hours, minutes, 0);

  if (prayerTime < now) {
    prayerTime.setDate(prayerTime.getDate() + 1);
  }

  const diff = prayerTime.getTime() - now.getTime();
  const hours_remaining = Math.floor(diff / (1000 * 60 * 60));
  const minutes_remaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds_remaining = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: hours_remaining,
    minutes: minutes_remaining,
    seconds: seconds_remaining,
  };
}
