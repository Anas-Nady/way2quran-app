import { View, Text, TouchableOpacity } from "react-native";
import getName from "../../helpers/getName";
import { flexDirection } from "../../helpers/flexDirection";
import React from "react";
import { useRouter } from "expo-router";
const SurahCard = ({ surah }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{ flexGrow: 1 }}
      onPress={() =>
        router.push({
          pathname: "surah",
          params: {
            pageNumber: surah.page,
            surahSlug: surah.slug,
          },
        })
      }
      className={`${flexDirection()} px-4 py-4 mx-auto w-[90%] border border-gray-600 rounded surah-card`}
    >
      <View className={`${flexDirection()} items-center gap-4 `}>
        <View
          style={{
            transform: [{ rotate: "45deg" }],
          }}
          className="flex-row items-center justify-center bg-green-600 w-9 h-9 "
        >
          <Text
            style={{
              transform: [{ rotate: "-45deg" }],
            }}
            className="block font-medium text-center text-white"
          >
            {surah.number}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-slate-200">
          {getName(surah)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(SurahCard);
