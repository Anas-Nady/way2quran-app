import React from "react";
import { View, FlatList } from "react-native";
import GoBackButton from "../components/ui/GoBackButton";
import HeadingScreen from "../components/HeadingScreen";
import { useTranslation } from "react-i18next";
import MushafCard from "../components/MushafCard";
import listMushaf from "../constants/listMushaf";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";
import { useContext } from "react";

export default function DownloadMushaf() {
  const { t } = useTranslation();
  const { screenWidth } = useContext(ScreenDimensionsContext);
  const cardWidth = screenWidth / 2;

  const renderHeader = () => {
    return (
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={t("downloadMushaf")} />
      </View>
    );
  };

  return (
    <View className="flex-1 w-full h-full mx-auto bg-gray-800">
      <FlatList
        data={listMushaf}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => (
          <MushafCard mushaf={item} width={cardWidth} />
        )}
        contentContainerStyle={{
          backgroundColor: "#1f2937",
        }}
      />
    </View>
  );
}
