import React from "react";
import { View, ScrollView } from "react-native";
import ContactUsForm from "../components/ContactUsForm";
import { useTranslate } from "../helpers/i18nHelper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomText from "../components/ui/CustomText";
import HeadingWithBackButton from "../components/ui/HeadingWithBackButton";

export default function ContactUs() {
  const translate = useTranslate("ContactUsScreen");

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{ flex: 1 }}
      scrollEnabled={true}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full bg-slate-800"
        style={{ flex: 1 }}
      >
        <HeadingWithBackButton headingText={translate("contactTitle")} />
        <View className="w-full mx-auto">
          <CustomText className="px-2 mb-1 text-base text-center text-gray-400">
            {translate("contactDescription")}
          </CustomText>
          <ContactUsForm />
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
