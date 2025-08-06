import React, { useState, useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getSurah } from "../services/api";
import GoBackButton from "../components/ui/GoBackButton";
import HeadingScreen from "../components/HeadingScreen";
import getName from "../helpers/getName";
import LoadingSpinner from "../components/States/LoadingSpinner";
import Error from "../components/States/Error";
import NotFoundResults from "../components/States/NotFoundResults";
import { appLanguage } from "../services/i18next";

export default function Surah() {
  const { surahSlug } = useLocalSearchParams();
  const [state, setState] = useState({
    loading: true,
    error: null,
  });

  const [surahInfo, setSurahInfo] = useState(null);

  useEffect(() => {
    setState({
      loading: true,
      error: null,
    });
    const fetchSurahContent = async () => {
      try {
        const res = await getSurah(surahSlug as string);
        const data = await res.json();
        setSurahInfo(data);
        setState({ error: null, loading: false });
      } catch (error) {
        setState({ error: error.message, loading: false });
      }
    };
    fetchSurahContent();
  }, []);

  const ListHeaderComponent = () => (
    <View>
      <GoBackButton />
      <HeadingScreen headingTxt={getName(surahInfo?.surah)} />
    </View>
  );

  const renderSurahCard = ({ item }) => {
    return (
      <Pressable className="w-full">
        <View className="w-[95%] border-b-2 border-gray-600 my-2 p-3 mx-auto">
          <View className="flex-col gap-1">
            <Text
              style={{ lineHeight: 40 }}
              className="text-[26px] font-verses font-bold text-slate-200"
            >
              {item.textArabic}
            </Text>
            {appLanguage === "en" && (
              <Text className="text-lg text-left text-slate-200">
                {item.textEnglish}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const ListEmptyComponent = () => <NotFoundResults />;

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
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: "#1f2937", // bg-gray-800
          }}
        />
      )}
    </View>
  );
}
