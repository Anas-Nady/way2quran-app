import { View, TouchableOpacity, Pressable } from "react-native";
import getName from "../../helpers/getName";

import React from "react";
import { useRouter } from "expo-router";
import CustomText from "../ui/CustomText";
const SurahCard = ({ surah }) => {
  const router = useRouter();

  return (
    <Pressable className={`flex-row mx-auto w-full surah-card`}>
      <View className=" px-4 py-4 w-[90%] mx-auto border border-gray-600 rounded mt-3">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/surah",
              params: {
                pageNumber: surah.page,
                surahSlug: surah.slug,
              },
            })
          }
          className={`flex-row items-center gap-4`}
        >
          <View
            style={{
              transform: [{ rotate: "45deg" }],
            }}
            className="flex-row items-center justify-center bg-green-600 rounded w-9 h-9"
          >
            <CustomText
              style={{
                transform: [{ rotate: "-45deg" }],
              }}
              className="block font-medium text-center text-white rounded font-english"
            >
              {surah.number}
            </CustomText>
          </View>
          <CustomText className="text-lg font-semibold text-slate-200">
            {getName(surah)}
          </CustomText>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default React.memo(SurahCard);
