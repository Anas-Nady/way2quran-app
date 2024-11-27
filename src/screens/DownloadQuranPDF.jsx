import { View, FlatList } from "react-native";
import GoBackButton from "../components/ui/GoBackButton";
import HeadingScreen from "../components/HeadingScreen";
import { useTranslation } from "react-i18next";
import QuranPDFCard from "../components/QuranPDFCard";
import listQuranPdf from "./../constants/listQuranPdf";
import { ScreenDimensionsContext } from "./../contexts/ScreenDimensionsProvider";
import { useContext } from "react";

export default function DownloadQuranPDF() {
  const { t } = useTranslation();
  const { screenWidth } = useContext(ScreenDimensionsContext);
  const cardWidth = screenWidth / 2 - 20; // accounting for padding and gap

  const renderHeader = () => {
    return (
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={t("downloadQuranPdf")} />
      </View>
    );
  };

  return (
    <View className="flex-1 w-full mx-auto bg-gray-800">
      <FlatList
        data={listQuranPdf}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-around",
        }}
        renderItem={({ item }) => (
          <QuranPDFCard quran={item} width={cardWidth} />
        )}
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: 1,
          width: "100%",
          backgroundColor: "#1f2937",
        }}
      />
    </View>
  );
}
