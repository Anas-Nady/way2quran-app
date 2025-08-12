import React from "react";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTranslate } from "./../../helpers/i18nHelper";

import CustomText from "../ui/CustomText";

export default function TopReciterBadge() {
  const translate = useTranslate("ReciterScreen");

  return (
    <View className={`flex-row justify-center items-center gap-1 `}>
      <AntDesign name="star" size={20} color="yellow" />
      <CustomText className={`text-[15px] font-bold text-slate-300`}>
        {translate("topReciters")}
      </CustomText>
    </View>
  );
}
