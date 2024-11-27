import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import getName from "../helpers/getName";

export default function QuranPDFCard({ quran, width }) {
  const handleDownloadPDF = () => {
    Linking.openURL(quran.downloadLink);
  };

  const quranName = getName(quran);

  return (
    <TouchableOpacity
      onPress={handleDownloadPDF}
      style={{ width: width }}
      className="my-2"
    >
      <View className="border border-gray-600 quran-pdf">
        <View className="items-center justify-center p-2">
          <Image
            source={{
              uri: quran.img,
              width: width - 20,
              height: width - 20,
            }}
            alt={quranName}
            resizeMode="contain"
          />
        </View>
        <Text className="py-1 font-semibold text-center text-slate-300 bg-gray-600 text-[15px]">
          {quranName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
