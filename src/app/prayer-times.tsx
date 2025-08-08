import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import * as Location from "expo-location";
import LoadingSpinner from "./../components/States/LoadingSpinner";
import Error from "./../components/States/Error";
import { useTranslate } from "./../helpers/i18nHelper";
import { flexDirection } from "../helpers/flexDirection";
import GoBackButton from "../components/ui/GoBackButton";
import {
  calculateRemainingTime,
  getNextPrayer,
  getPrayerTimes,
} from "../services/prayerTimes";
import { formatPrayerTime } from "../helpers/formatTime";
import { INextPrayer, IPrayerTimes, IRemainingTime } from "../types/types";
import CustomText from "../components/CustomText";
import HeadingScreen from "../components/HeadingScreen";

const PrayerTimes = () => {
  const translate = useTranslate("PrayerTimes");
  const [prayerTimes, setPrayerTimes] = useState<IPrayerTimes | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<INextPrayer | null>(null);
  const [remainingTime, setRemainingTime] = useState<IRemainingTime | null>(
    null
  );

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

        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        const addressResponse = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (addressResponse[0]) {
          const { city, country } = addressResponse[0];
          setAddress(`${city}, ${country}`);
        }

        const times = await getPrayerTimes({ latitude, longitude });
        const next = getNextPrayer(times);
        setPrayerTimes(times);
        setNextPrayer(next);

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

      // Advance to the next prayer if time has passed
      if (
        remaining &&
        remaining.hours === 0 &&
        remaining.minutes === 0 &&
        remaining.seconds === 0
      ) {
        const next = getNextPrayer(prayerTimes);
        setNextPrayer(next);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes, nextPrayer]);

  const renderHeader = () => {
    return (
      <View>
        <GoBackButton />
        <View>
          <HeadingScreen
            headingTxt={translate("title")}
            extraStyles="text-4xl font-bold text-center text-white"
          />
          <CustomText className="text-lg font-bold text-center text-gray-400">
            {address}
          </CustomText>
          {remainingTime && (
            <CustomText className="px-2 py-1 mb-2 text-lg text-center text-white">
              {translate("remainingTime")}{" "}
              {translate(nextPrayer.name.toLowerCase())}: {remainingTime.hours}:
              {String(remainingTime.minutes).padStart(2, "0")}:
              {String(remainingTime.seconds).padStart(2, "0")}
            </CustomText>
          )}
        </View>
      </View>
    );
  };

  const renderPrayerItem = ({ item }) => {
    const [prayer, time] = item;
    const isCurrentPrayer = prayer === nextPrayer?.name.toLowerCase();

    return (
      <Pressable className="w-full">
        <View
          className={`${flexDirection()} w-[90%] mx-auto items-center justify-between border border-gray-500 p-3 my-2 rounded
          ${isCurrentPrayer ? "bg-green-500 border-none" : "bg-gray-700"}`}
        >
          <View>
            <CustomText
              className={`text-xl font-semibold ${
                isCurrentPrayer ? "font-bold text-white" : "text-gray-300"
              }`}
            >
              {translate(prayer)}
              {":"}
            </CustomText>
          </View>
          <CustomText
            className={`text-xl font-semibold ${
              isCurrentPrayer ? "font-bold text-white" : "text-gray-300"
            }`}
          >
            {formatPrayerTime(time)}
          </CustomText>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <View className="flex-1 w-full mx-auto bg-gray-800">
      <FlatList
        data={Object.entries(prayerTimes)}
        keyExtractor={([prayer]) => prayer}
        renderItem={renderPrayerItem}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: "100%",
        }}
      />
    </View>
  );
};

export default PrayerTimes;
