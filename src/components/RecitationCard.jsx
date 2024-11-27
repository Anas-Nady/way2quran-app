import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import getName from "../helpers/getName";
import { useNavigation } from "@react-navigation/native";

const RecitationCard = ({ recitation }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Reciters", { recitationSlug: recitation.slug })
      }
      key={recitation.slug}
      className="flex-row items-center justify-center w-[95%] mx-auto p-3 bg-gray-800 border border-gray-700 rounded-lg"
    >
      <View className="overflow-hidden ">
        <Text className="text-lg font-semibold text-slate-50">
          {getName(recitation)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(RecitationCard);
