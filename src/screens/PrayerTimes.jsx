import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import * as Location from "expo-location";
import LoadingSpinner from "./../components/States/LoadingSpinner";
import Error from "./../components/States/Error";
import { useTranslate } from "./../helpers/i18nHelper.js";
import { flexDirection } from "../helpers/flexDirection.js";
import GoBackButton from "../components/ui/GoBackButton.jsx";
import {
  calculateRemainingTime,
  getNextPrayer,
  getPrayerTimes,
} from "../services/prayerTimes.js";

const PrayerTimes = () => {
  const translate = useTranslate("PrayerTimes");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const getLocationAndPrayerTimes = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError(translate("locationPermissionDenied"));
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});

        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (addressResponse[0]) {
          const { city, country } = addressResponse[0];
          setAddress(`${city}, ${country}`);
        }

        const times = await getPrayerTimes({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setPrayerTimes(times);
        setNextPrayer(getNextPrayer(times));
        setLoading(false);
      } catch (error) {
        setError(error?.message || translate("fetchError"));
        setLoading(false);
      }
    };

    getLocationAndPrayerTimes();
  }, []);

  useEffect(() => {
    if (!prayerTimes || !nextPrayer) return;

    const timer = setInterval(() => {
      const remaining = calculateRemainingTime(prayerTimes, nextPrayer);
      setRemainingTime(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes, nextPrayer]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 w-full p-4 bg-gray-800"
      alwaysBounceVertical={false}
    >
      <View>
        <GoBackButton />
        <View className="mt-5">
          <Text className="text-4xl font-bold text-center text-white">
            {translate("title")}
          </Text>
          <Text className="px-2 py-1 text-lg text-center text-green-500 rounded-xl">
            {address}
          </Text>

          {remainingTime && (
            <Text className="px-2 py-1 mb-6 text-lg text-center text-white rounded-xl">
              {translate("remainingTime")}{" "}
              {translate(nextPrayer.name.toLowerCase())}: {remainingTime.hours}:
              {String(remainingTime.minutes).padStart(2, "0")}:
              {String(remainingTime.seconds).padStart(2, "0")}
            </Text>
          )}
        </View>
      </View>

      <View className="p-6 border border-green-500 rounded-lg">
        {Object.entries(prayerTimes).map(([prayer, time]) => {
          const isPassed =
            prayer !== nextPrayer?.name.toLowerCase() &&
            getNextPrayer(prayerTimes)?.name.toLowerCase() !== prayer;

          return (
            <View
              key={prayer}
              className={`${flexDirection()} items-center justify-between gap-3 border border-gray-500 px-3 py-1 pb-4 my-3 rounded
                  ${isPassed ? "bg-gray-700" : ""} 
                  ${
                    prayer === nextPrayer?.name.toLowerCase()
                      ? "bg-green-500 border-none"
                      : ""
                  }`}
            >
              <View>
                <Text
                  className={`text-xl font-semibold ${
                    prayer === nextPrayer?.name.toLowerCase()
                      ? "font-bold text-white"
                      : "text-gray-300"
                  }`}
                >
                  {translate(prayer)}
                  {":"}
                </Text>
              </View>
              <Text
                className={`text-xl font-semibold ${
                  prayer === nextPrayer?.name.toLowerCase()
                    ? "font-bold text-white"
                    : "text-gray-300"
                }`}
              >
                {time}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default PrayerTimes;
