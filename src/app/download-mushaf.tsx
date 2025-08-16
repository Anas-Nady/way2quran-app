import React from "react";
import { View, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import MushafCard from "../components/MushafCard";
import listMushaf from "../constants/listMushaf";
import HeadingWithBackButton from "../components/ui/HeadingWithBackButton";

export default function DownloadMushaf() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 w-full h-full mx-auto bg-gray-800">
      <FlatList
        data={listMushaf}
        ListHeaderComponent={
          <HeadingWithBackButton headingText={t("downloadMushaf")} />
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => <MushafCard mushaf={item} />}
        contentContainerStyle={{
          backgroundColor: "#1f2937",
        }}
      />
    </View>
  );
}
