import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Pressable,
} from "react-native";
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
    <Pressable disabled={loading}>
      <View className="w-full">
        <TouchableOpacity
          className="p-2 my-3 w-[80%] mx-auto border border-gray-600"
          onPress={handleDownloadMushaf}
        >
          <View className="items-center justify-center">
            <Image
              source={{ uri: mushaf.imageURL }}
              alt={mushafName}
              resizeMode="contain"
              style={{ width: "100%", height: 300 }}
            />
          </View>
          <Text className="py-1 font-semibold text-center text-slate-300 bg-gray-600 text-[15px]">
            {mushafName}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}
