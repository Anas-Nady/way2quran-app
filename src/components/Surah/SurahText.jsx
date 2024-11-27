import React from "react";
import { View, Text } from "react-native";
import { currentLanguage } from "../../helpers/flexDirection";

function SurahText({ item }) {
  return (
    <View
      style={{ flexGrow: 1 }}
      className="w-[90%] py-4 mx-auto border-b border-gray-600"
    >
      <Text className="text-2xl font-medium text-gray-300 font-quran">
        {item.textArabic}
        <Text style={{ fontFamily: "Quran-verse" }} className={`text-4xl`}>
          {+item.id}
        </Text>
      </Text>
      {currentLanguage === "en" && (
        <Text className="mb-1 text-2xl font-medium text-gray-300 font-english">
          {item.textEnglish}{" "}
          <Text className={`font-verses text-4xl`}>{item.id}</Text>
        </Text>
      )}
    </View>
  );
}

export default React.memo(SurahText);
