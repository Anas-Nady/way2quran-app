import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import bgImage from "./../assets/images/home-background.png";
import { useTranslate } from "../helpers/i18nHelper";
import fullLogo from "./../assets/images/full-logo.png";
import { flexDirection } from "./../helpers/flexDirection";
import { useRouter } from "expo-router";

export default function App() {
  const translate = useTranslate("Welcome");
  const router = useRouter();
  const links = [
    { href: `about`, title: translate("aboutTitle") },
    { href: `contact`, title: translate("contactTitle") },
  ];

  return (
    <ImageBackground
      source={bgImage}
      style={{
        paddingVertical: 6,
        flex: 1,
      }}
      resizeMode="cover"
      className="bg-center"
    >
      <View className="flex-col items-center justify-between flex-1">
        <View className="items-center justify-center flex-1">
          <Text className="px-3 text-3xl font-semibold text-center text-slate-100">
            {translate("part1")}{" "}
            <Text className="text-green-500">{translate("part2")}</Text>
            {translate("part3")}
          </Text>
          <Image
            source={fullLogo}
            style={{
              height: "55%",
            }}
            resizeMode="contain"
          />
        </View>
        <View className={`${flexDirection()}`}>
          {links.map((link) => (
            <TouchableOpacity
              key={link.href}
              onPress={() => router.push(link.href)}
            >
              <Text className="text-[16px] font-notoKufi mx-3 text-secondary">
                {link.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}
