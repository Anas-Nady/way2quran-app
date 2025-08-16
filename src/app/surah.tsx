import React, { useState, useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getSurah } from "../services/api";
import getName from "../helpers/getName";
import LoadingSpinner from "../components/States/LoadingSpinner";
import Error from "../components/States/Error";
import NotFoundResults from "../components/States/NotFoundResults";
import { appLanguage } from "../services/i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeadingWithBackButton from "../components/ui/HeadingWithBackButton";

export default function Surah() {
  const { surahSlug } = useLocalSearchParams();
  const [state, setState] = useState({
    loading: true,
    error: null,
  });

  const [surahInfo, setSurahInfo] = useState(null);

  useEffect(() => {
    const fetchSurahContent = async () => {
      setState({
        loading: true,
        error: null,
      });

      try {
        const storedSurah = await AsyncStorage.getItem(`surah_${surahSlug}`);
        if (storedSurah) {
          setSurahInfo(JSON.parse(storedSurah));
          setState({ loading: false, error: null });
          return;
        }

        const res = await getSurah(surahSlug as string);
        const data = await res.json();

        await AsyncStorage.setItem(`surah_${surahSlug}`, JSON.stringify(data));
        setSurahInfo(data);
        setState({ error: null, loading: false });
      } catch (error) {
        setState({ error: error.message, loading: false });
      }
    };
    fetchSurahContent();
  }, []);

  const renderSurahCard = ({ item }) => {
    return (
      <Pressable className="flex-row w-full">
        <View className="w-[95%] border-b-2 border-gray-600 py-4 mx-auto">
          <View className="flex-row items-end justify-start">
            <Text className="text-[26px] text-center mx-auto font-arabic text-slate-200">
              {item.textArabic}
              <Text className="text-5xl font-verses text-slate-200">
                {item.id}
              </Text>
            </Text>
          </View>
          {appLanguage === "en" && (
            <View className="flex-row items-end justify-start">
              <Text className="mx-auto text-lg text-center text-slate-200">
                {item.textEnglish}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 w-full bg-gray-800">
      {state.loading ? (
        <LoadingSpinner />
      ) : state.error ? (
        <Error message={state?.error} />
      ) : (
        <FlatList
          data={surahInfo?.surah?.verses}
          renderItem={renderSurahCard}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListHeaderComponent={
            <HeadingWithBackButton headingText={getName(surahInfo?.surah)} />
          }
          ListEmptyComponent={<NotFoundResults />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: "#1f2937", // bg-gray-800
          }}
        />
      )}
    </View>
  );
}
