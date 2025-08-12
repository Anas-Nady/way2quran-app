import React from "react";
import { View, TouchableOpacity } from "react-native";
import getName from "../helpers/getName";
import { useRouter } from "expo-router";
import CustomText from "./ui/CustomText";

const RecitationCard = ({ recitation }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/reciters",
          params: { recitationSlug: recitation.slug },
        })
      }
      key={recitation.slug}
      activeOpacity={1}
      className="flex-row items-center justify-center w-full mx-auto bg-gray-800"
    >
      <View className="w-[95%] my-2 border border-gray-600 rounded-lg p-3">
        <CustomText className="text-lg font-semibold text-center text-slate-50">
          {getName(recitation)}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(RecitationCard);
