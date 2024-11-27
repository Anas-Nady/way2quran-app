import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import bgImage from "./../assets/images/home-background.png";
import { useContext } from "react";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";
import { useTranslate } from "../helpers/i18nHelper";
import fullLogo from "./../assets/images/full-logo.png";
import { useNavigation } from "@react-navigation/native";
import { flexDirection } from "./../helpers/flexDirection";

export default function Welcome() {
  const translate = useTranslate("Welcome");
  const navigation = useNavigation();
  const { screenWidth, screenHeight } = useContext(ScreenDimensionsContext);

  const links = [
    { href: `AboutUs`, title: translate("aboutTitle") },
    { href: `ContactUs`, title: translate("contactTitle") },
  ];

  return (
    <ImageBackground
      source={bgImage}
      style={{
        width: screenWidth,
        height: screenHeight - 130,
        paddingVertical: 24,
      }}
      resizeMode="cover"
      className="h-full bg-center "
    >
      <View className="flex-col items-center justify-between flex-1">
        <View className="items-center justify-center flex-1 ">
          <Text className="px-3 text-3xl font-semibold text-center text-slate-100">
            {translate("part1")}{" "}
            <Text className="text-green-500">{translate("part2")}</Text>
            {translate("part3")}
          </Text>
          <Image
            source={fullLogo}
            style={{
              width: screenWidth * 0.8,
              height: screenHeight * 0.35,
            }}
            resizeMode="contain"
          />
        </View>
        <View className={`${flexDirection()}`}>
          {links.map((link) => (
            <TouchableOpacity
              key={link.href}
              onPress={() => navigation.navigate(link.href)}
            >
              <Text className="text-[16px] font-notoKufi mx-3  text-secondary">
                {link.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}
