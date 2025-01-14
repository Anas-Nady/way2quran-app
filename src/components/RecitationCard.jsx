import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import getName from "../helpers/getName";
import { useRouter } from "expo-router";

const RecitationCard = ({ recitation }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "reciters",
          params: { recitationSlug: recitation.slug },
        })
      }
      key={recitation.slug}
      className="flex-row items-center justify-center w-[95%] mx-auto p-3 bg-gray-800 border border-gray-700 rounded-lg"
    >
      <Text className="text-lg font-semibold text-center text-slate-50">
        {getName(recitation)}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(RecitationCard);
