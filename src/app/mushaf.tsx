import React, { useMemo } from "react";
import { View, FlatList } from "react-native";
import HeadingScreen from "../components/HeadingScreen";
import { useTranslation } from "react-i18next";
import GoBackButton from "../components/ui/GoBackButton";
import SurahsList from "../constants/surahsList";
import SurahCard from "../components/Surah/SurahCard";

export default function Mushaf() {
  const { t } = useTranslation();

  const renderHeader = useMemo(() => {
    return (
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={t("mushaf")} />
      </View>
    );
  }, []);

  return (
    <View className="flex-1 w-full bg-gray-800">
      <FlatList
        data={SurahsList}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => <SurahCard surah={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          backgroundColor: "#1f2937",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
