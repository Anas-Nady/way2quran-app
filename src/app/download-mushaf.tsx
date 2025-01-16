import { View, FlatList } from "react-native";
import GoBackButton from "../components/ui/GoBackButton";
import HeadingScreen from "../components/HeadingScreen";
import { useTranslation } from "react-i18next";
import MushafCard from "../components/MushafCard";
import listMushaf from "../constants/listMushaf";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";
import { useContext } from "react";
import { rowDirection } from "../helpers/flexDirection";

export default function DownloadMushaf() {
  const { t } = useTranslation();
  const { screenWidth } = useContext(ScreenDimensionsContext);
  const cardWidth = screenWidth / 2 - 12;

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
        keyExtractor={(item) => item.slug}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-around",
          flexDirection: rowDirection(),
        }}
        renderItem={({ item }) => (
          <MushafCard mushaf={item} width={cardWidth} />
        )}
        contentContainerStyle={{
          paddingBottom: 20,
          width: "100%",
          backgroundColor: "#1f2937",
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
