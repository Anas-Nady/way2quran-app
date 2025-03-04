import React from "react";
import { View, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import recitations from "./../constants/recitations";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import RecitationCard from "../components/RecitationCard";

export default function Recitations() {
  const { t } = useTranslation();

  const renderItem = ({ item }) => <RecitationCard recitation={item} />;

  const renderHeader = () => {
    return (
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={t("frequentRecitations")} />
      </View>
    );
  };

  return (
    <View className="flex-1 w-full h-full bg-gray-800">
      <FlatList
        data={recitations.slice(3)}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={{
          gap: 12,
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
