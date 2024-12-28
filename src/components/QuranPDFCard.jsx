import { useState } from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import getName from "../helpers/getName";
import { incrementDownloadCount } from "../services/api";

export default function QuranPDFCard({ quran, width }) {
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      await incrementDownloadCount(quran.slug);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    Linking.openURL(quran.downloadURL);
  };

  const quranName = getName(quran);

  return (
    <TouchableOpacity
      onPress={handleDownloadPDF}
      disabled={loading}
      style={{ width: width }}
      className="my-2"
    >
      <View className="border border-gray-600 quran-pdf">
        <View className="items-center justify-center p-2">
          <Image
            source={{
              uri: quran.imageURL,
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
