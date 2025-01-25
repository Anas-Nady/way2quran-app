import React from "react";
import { Text, View } from "react-native";
import { isRTL } from "../../helpers/flexDirection";
import { useTranslate } from "../../helpers/i18nHelper";

const DescriptionList = ({ data }) => {
  const translate = useTranslate("AboutScreen");

  return data.map((_: string, index: number) => (
    <View
      key={index + 1}
      className="p-2.5 w-[90%] mx-auto bg-gray-700 border border-gray-600 rounded"
    >
      <Text
        className={`${
          isRTL ? "text-[20px]" : "text-[17px]"
        } font-medium leading-normal text-center text-green-500`}
      >
        {translate(`about_${index + 1}`)}
      </Text>
    </View>
  ));
};

export default DescriptionList;
