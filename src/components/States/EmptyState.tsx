import { View, Text } from "react-native";
import { useTranslate } from "../../helpers/i18nHelper";
import { Ionicons } from "@expo/vector-icons";

export default function EmptyState({ message }) {
  const translate = useTranslate("EmptyState");

  return (
    <View className="flex-1 p-5">
      <View className="items-center justify-center flex-1">
        <Ionicons name="search-outline" size={80} color="#9CA3AF" />
        <Text className="mt-5 text-3xl font-bold text-gray-100">
          {translate("title")}
        </Text>
        <Text className="mt-5 text-lg font-semibold text-center text-gray-200">
          {message}
        </Text>
      </View>
    </View>
  );
}
