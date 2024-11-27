import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslate } from "../../helpers/i18nHelper";
import { flexDirection } from "../../helpers/flexDirection";
import { chunkArray } from "../../helpers/chunkArray";

export default function TopBarMenu({ closeMenu }) {
  const navigation = useNavigation();
  const translate = useTranslate("TopBarMenu");

  const handleNavigation = (route, params) => {
    navigation.navigate(route, params);
    closeMenu();
  };

  const menuLinks = [
    {
      label: translate("fullQuran"),
      routeName: "Reciters",
      params: { recitationSlug: "full-holy-quran" },
    },
    {
      label: translate("frequentRecitations"),
      routeName: "Recitations",
      params: {},
    },
    {
      label: translate("variousRecitations"),
      routeName: "Reciters",
      params: { recitationSlug: "various-recitations" },
    },
    {
      label: translate("downloadQuran"),
      routeName: "DownloadQuranPDF",
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
              <Text className="text-lg font-bold text-center text-gray-200">
                {link.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}
