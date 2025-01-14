import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslate } from "../../helpers/i18nHelper.js";
import { flexDirection } from "../../helpers/flexDirection.js";
import prayerTimesIcon from "./../../assets/images/mosqueIcon.png";
import { useRouter } from "expo-router";

export default function TabBar({ closeMenu }) {
  const translate = useTranslate("TabBar");
  const router = useRouter();
  const tabsLinks = [
    { label: translate("home"), routeName: "/", icon: "home" },
    {
      label: translate("playlist"),
      routeName: "playlist",
      icon: "playlist-add",
    },
    {
      label: translate("favorites"),
      routeName: "favorites",
      icon: "favorite",
    },
    {
      label: translate("mushaf"),
      routeName: "mushaf",
      icon: "menu-book",
    },
  ];
  const handleMenuPress = (routeName) => {
    closeMenu();
    router.push(routeName);
  };

  return (
    <View className="w-[97%] bg-gray-700 rounded-full mx-auto py-1 px-4">
      <View className={`${flexDirection()} items-center justify-between`}>
        {tabsLinks.map((tab, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleMenuPress(tab.routeName)}
          >
            <View className="flex-col items-center justify-center">
              <MaterialIcons name={tab.icon} size={24} color="#22c55e" />
              <Text className="font-semibold text-green-500 text-md">
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => router.push("prayer-times")}>
          <View className="flex-col items-center justify-center">
            <Image source={prayerTimesIcon} width={24} />
            <Text className="font-semibold text-green-500 text-md">
              {translate("prayerTimes")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
