import { View, Text, ScrollView } from "react-native";
import HeadingScreen from "./../components/HeadingScreen";
import GoBackButton from "../components/ui/GoBackButton";
import { useTranslate } from "../helpers/i18nHelper";
import {
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { socialMedia } from "../constants/socialMedia";
import { useState } from "react";
import { Linking } from "react-native";
import Alert from "../components/ui/Alert";
import { TouchableOpacity } from "react-native";
import { chunkArray } from "../helpers/chunkArray";
import { flexDirection, isRTL } from "../helpers/flexDirection";

const AboutUsList = () => {
  const translate = useTranslate("AboutScreen");
  const [error, setError] = useState("");

  const handlePress = (url) => {
    Linking.openURL(url);
  };

  const SocialMediaIcons = ({ socialMediaItems }) => {
    const chunks = chunkArray(socialMediaItems, 5);
    return (
      <View>
        {chunks.map((chunk, index) => (
          <View
            key={index}
            className={`${flexDirection()} my-1 justify-between items-center p-4 w-[90%] mx-auto bg-gray-700 border border-gray-600`}
          >
            {chunk.map((item) => {
              const IconComponent =
                item.icon.includes("gmail") || item.icon.includes("web")
                  ? MaterialCommunityIcons
                  : item.icon === "threads" || item.icon === "square-x-twitter"
                  ? FontAwesome6
                  : FontAwesome5;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handlePress(item.url)}
                >
                  <IconComponent
                    name={item.icon}
                    size={24}
                    color={item.color}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      className="w-full bg-gray-800"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <GoBackButton />
        <HeadingScreen headingTxt={translate("aboutTitle")} />
      </View>

      {error && (
        <Alert message={error} onClose={() => setError("")} type="error" />
      )}

      {Array.from({ length: 3 }, (_, index) => (
        <View
          key={index + 1}
          className="p-2.5 my-1.5 w-[90%] mx-auto bg-gray-700 border border-gray-600 rounded"
        >
          <Text
            className={`${
              isRTL ? "text-[20px]" : "text-[17px]"
            } font-medium leading-normal text-center text-green-500`}
          >
            {translate(`about_${index + 1}`)}
          </Text>
        </View>
      ))}

      <SocialMediaIcons socialMediaItems={socialMedia} />
    </ScrollView>
  );
};

export default AboutUsList;
