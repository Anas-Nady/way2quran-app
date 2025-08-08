import React from "react";
import { Pressable, View } from "react-native";
import { isRTL } from "../../helpers/flexDirection";
import { useTranslate } from "../../helpers/i18nHelper";
import CustomText from "../CustomText";

const DescriptionCard = ({ index }) => {
  const translate = useTranslate("AboutScreen");
  const descriptionText = translate(`about_${+index}`);
  return (
    <Pressable className="w-full">
      <View className="p-2.5 w-[90%] mb-2 mx-auto bg-gray-700 border border-gray-600 rounded">
        <CustomText
          className={`${
            isRTL ? "text-[20px]" : "text-[17px]"
          } font-medium leading-normal text-center text-green-500`}
        >
          {descriptionText}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default DescriptionCard;
