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
        alignSelf: isRTL ? "flex-start" : "flex-end",
      }}
      className="p-1 m-1"
      onPress={() => router.back()}
    >
      <View className="p-1 bg-green-500 w-[30px] rounded-full">
        <Entypo name="forward" size={22} color="white" />
      </View>
    </Pressable>
  );
}
