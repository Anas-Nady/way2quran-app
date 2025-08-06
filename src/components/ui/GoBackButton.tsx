import React from "react";
import { Pressable, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { isRTL } from "../../helpers/flexDirection";
import { useRouter } from "expo-router";

export default function GoBackButton() {
  const router = useRouter();
  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: isRTL ? "flex-start" : "flex-end",
      }}
      className="px-3 pt-3"
      onPress={() => router.back()}
    >
      <View className="p-1 bg-green-500 w-[30px] rounded-full">
        <Entypo name="forward" size={22} color="white" />
      </View>
    </Pressable>
  );
}
