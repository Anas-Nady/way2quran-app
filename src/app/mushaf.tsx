import React from "react";
import { View, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import SurahsList from "../constants/surahsList";
import SurahCard from "../components/Surah/SurahCard";
import HeadingWithBackButton from "../components/ui/HeadingWithBackButton";

export default function Mushaf() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 w-full bg-gray-800">
      <FlatList
        data={SurahsList}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => <SurahCard surah={item} />}
        ListHeaderComponent={
          <HeadingWithBackButton headingText={t("mushaf")} />
        }
        contentContainerStyle={{
          backgroundColor: "#1f2937",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
