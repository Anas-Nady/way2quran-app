import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useTranslate } from "../helpers/i18nHelper";
import { flexDirection } from "./../helpers/flexDirection";
import { Href, useRouter } from "expo-router";
import CustomText from "../components/CustomText";
const bgImage = require("./../assets/images/home-background.png");
const fullLogo = require("./../assets/images/full-logo.png");

export default function App() {
  const translate = useTranslate("Welcome");
  const router = useRouter();
  const links = [
    { href: `/about`, title: translate("aboutTitle") },
    { href: `/contact`, title: translate("contactTitle") },
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
          <CustomText className="px-3 pt-5 text-3xl font-bold text-center text-slate-100">
            {translate("part1")}{" "}
            <CustomText className="text-green-500">
              {translate("part2")}
            </CustomText>
            {translate("part3")}
          </CustomText>
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
              onPress={() => router.push(link.href as Href)}
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
