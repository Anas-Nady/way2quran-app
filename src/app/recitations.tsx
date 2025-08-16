import React from "react";
import { View, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import recitations from "./../constants/recitations";
import RecitationCard from "../components/RecitationCard";
import HeadingWithBackButton from "../components/ui/HeadingWithBackButton";

export default function Recitations() {
  const { t } = useTranslation();

  const renderItem = ({ item }) => <RecitationCard recitation={item} />;

  return (
    <View className="flex-1 w-full h-full bg-gray-800">
      <FlatList
        data={recitations.slice(3)}
        ListHeaderComponent={
          <HeadingWithBackButton headingText={t("frequentRecitations")} />
        }
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={{}}
        style={{ flex: 1 }}
      />
    </View>
  );
}
