import { View, Text, TouchableOpacity } from "react-native";
import { useTranslate } from "../../helpers/i18nHelper";
import { flexDirection, isRTL } from "../../helpers/flexDirection";
import { chunkArray } from "../../helpers/chunkArray";
import { useRouter } from "expo-router";

export default function TopBarMenu({ closeMenu }) {
  const translate = useTranslate("TopBarMenu");
  const router = useRouter();

  const handleNavigation = (route, params) => {
    router.push({
      pathname: route,
      params,
    });
    closeMenu();
  };

  const menuLinks = [
    {
      label: translate("fullQuran"),
      routeName: "/reciters",
      params: { recitationSlug: "full-holy-quran" },
    },
    {
      label: translate("frequentRecitations"),
      routeName: "/recitations",
      params: {},
    },
    {
      label: translate("variousRecitations"),
      routeName: "/reciters",
      params: { recitationSlug: "various-recitations" },
    },
    {
      label: translate("downloadQuran"),
      routeName: "/download-mushaf",
      params: {},
    },
  ];

  const menuChunks = chunkArray(menuLinks, 2);

  return (
    <View className="flex-wrap">
      {menuChunks.map((chunk, rowIndex) => (
        <View
          key={rowIndex}
          className={`${flexDirection()} justify-between my-2.5 p-1`}
        >
          {chunk.map((link, linkIndex) => (
            <TouchableOpacity
              key={linkIndex}
              onPress={() => handleNavigation(link.routeName, link.params)}
              className="w-[49%] p-4 border-b border-gray-700"
            >
              <Text
                className={`${
                  isRTL ? "text-[18px]" : "text-[16px]"
                } font-bold text-center text-gray-200`}
              >
                {link.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}
