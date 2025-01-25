import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import getName from "../helpers/getName";
import { incrementDownloadCount } from "../services/api";

export default function MushafCard({ mushaf, width }) {
  const [loading, setLoading] = useState(false);

  const handleDownloadMushaf = async () => {
    try {
      setLoading(true);
      await incrementDownloadCount({ slug: mushaf.slug });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    Linking.openURL(mushaf.downloadURL);
  };

  const mushafName = getName(mushaf);

  return (
    <TouchableOpacity
      onPress={handleDownloadMushaf}
      disabled={loading}
      style={{ width: width }}
      className="my-2"
    >
      <View className="border border-gray-600">
        <View className="items-center justify-center p-2">
          <Image
            source={{
              uri: mushaf.imageURL,
              width: width - 20,
              height: width - 20,
            }}
            alt={mushafName}
            resizeMode="contain"
          />
        </View>
        <Text className="py-1 font-semibold text-center text-slate-300 bg-gray-600 text-[15px]">
          {mushafName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
